import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Zone, Marker, UserLocation, MapFilters, ProximitySettings } from '../../domain/entities';
import {
  getMapDataUseCase,
  getNearbyMarkersUseCase,
  toggleFavoriteMarkerUseCase,
} from '../../di/container';
import {
  getUserLocation,
  watchUserLocation,
  stopWatchingLocation,
  getCurrentZone,
  checkGeolocationSupport,
} from '../../infrastructure/utils/geolocation.utils';

interface MapState {
  // 📊 Estado
  zones: Zone[];
  markers: Marker[];
  nearbyMarkers: Marker[];
  selectedZone: Zone | null;
  selectedMarker: Marker | null;
  currentZone: Zone | null;
  userLocation: UserLocation | null;
  filters: MapFilters;
  isLoading: boolean;
  isLoadingLocation: boolean;
  error: string | null;
  locationError: string | null;
  mapLoaded: boolean;
  locationWatchId: number | null;
  geolocationSupported: boolean;
  geolocationPermitted: boolean;

  // 🗺️ Map Settings
  center: [number, number];
  zoom: number;
  proximitySettings: ProximitySettings;

  // 🎯 UI State
  showUserLocation: boolean;
  followUserLocation: boolean;
  showNearbyOnly: boolean;

  // 🔧 Acciones - Data
  loadMapData: () => Promise<void>;
  loadNearbyMarkers: () => Promise<void>;
  refreshMapData: () => Promise<void>;

  // 🔧 Acciones - Location
  checkLocationSupport: () => Promise<void>;
  requestUserLocation: () => Promise<void>;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  updateUserLocation: (location: UserLocation) => void;
  useDefaultLocation: () => void;

  // 🔧 Acciones - Selection
  setSelectedZone: (zone: Zone | null) => void;
  setSelectedMarker: (marker: Marker | null) => void;
  toggleFavorite: (markerId: number) => Promise<void>;

  // 🔧 Acciones - Filters
  setFilters: (filters: MapFilters) => void;
  resetFilters: () => void;

  // 🔧 Acciones - Map
  setMapLoaded: (loaded: boolean) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setShowUserLocation: (show: boolean) => void;
  setFollowUserLocation: (follow: boolean) => void;
  setShowNearbyOnly: (show: boolean) => void;
  setProximitySettings: (settings: Partial<ProximitySettings>) => void;

  // 🔧 Acciones - Utils
  clearError: () => void;
  clearLocationError: () => void;
  reset: () => void;
}

const DEFAULT_CENTER: [number, number] = [-86.8515, 21.1619]; // Cancún
const DEFAULT_ZOOM = 13;
const DEFAULT_PROXIMITY: ProximitySettings = {
  nearbyRadius: 1000, // 1km radius for better proximity detection
  loadRadius: 5000,
  autoRefreshInterval: 30000,
};

const initialState = {
  zones: [],
  markers: [],
  nearbyMarkers: [],
  selectedZone: null,
  selectedMarker: null,
  currentZone: null,
  userLocation: null,
  filters: {},
  isLoading: false,
  isLoadingLocation: false,
  error: null,
  locationError: null,
  mapLoaded: false,
  locationWatchId: null,
  geolocationSupported: true,
  geolocationPermitted: false,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  proximitySettings: DEFAULT_PROXIMITY,
  showUserLocation: true,
  followUserLocation: false, // Don't auto-follow by default
  showNearbyOnly: false,
};

export const useMapStore = create<MapState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 🔍 Verificar soporte de geolocalización
        checkLocationSupport: async () => {
          try {
            const support = await checkGeolocationSupport();
            set({
              geolocationSupported: support.supported,
              geolocationPermitted: support.permitted,
            });

            if (!support.supported) {
              set({ 
                locationError: support.message,
                userLocation: {
                  lat: DEFAULT_CENTER[1],
                  lng: DEFAULT_CENTER[0],
                  accuracy: undefined,
                  timestamp: Date.now(),
                },
              });
            }
          } catch (error) {
            console.error('Error checking location support:', error);
          }
        },

        // 🗺️ Cargar datos del mapa
        loadMapData: async () => {
          set({ isLoading: true, error: null });
          try {
            const { userLocation, filters } = get();
            const data = await getMapDataUseCase.execute(
              userLocation || undefined,
              undefined,
              filters
            );

            let currentZone = null;
            if (userLocation) {
              currentZone = getCurrentZone(userLocation, data.zones);
            }

            set({
              zones: data.zones,
              markers: data.markers,
              currentZone,
              isLoading: false,
              error: null,
            });

            if (userLocation) {
              get().loadNearbyMarkers();
            }
          } catch (error: any) {
            set({
              error: error.message || 'Error al cargar datos del mapa',
              isLoading: false,
            });
            console.error('Load map data error:', error);
          }
        },

        // 📍 Cargar marcadores cercanos
        loadNearbyMarkers: async () => {
          const { userLocation, proximitySettings } = get();
          if (!userLocation) return;

          try {
            const nearby = await getNearbyMarkersUseCase.execute(
              userLocation,
              proximitySettings.nearbyRadius
            );

            set({ nearbyMarkers: nearby });
          } catch (error: any) {
            console.error('Error loading nearby markers:', error);
          }
        },

        // 🔄 Refrescar datos
        refreshMapData: async () => {
          await get().loadMapData();
        },

        // 📍 Solicitar ubicación del usuario
        requestUserLocation: async () => {
          set({ isLoadingLocation: true, locationError: null });
          
          try {
            const location = await getUserLocation();

            set({
              userLocation: location,
              isLoadingLocation: false,
              locationError: null,
              geolocationPermitted: true,
            });

            // Update map center if not manually moved
            if (get().followUserLocation) {
              set({
                center: [location.lng, location.lat],
                zoom: 15,
              });
            }

            await get().loadMapData();
          } catch (error: any) {
            const errorMessage = error.message || 'Error al obtener ubicación';
            
            set({
              locationError: errorMessage,
              isLoadingLocation: false,
            });

            console.warn('Location request failed:', errorMessage);

            // Use default location as fallback
            if (!get().userLocation) {
              get().useDefaultLocation();
            }
          }
        },

        // 🎯 Usar ubicación por defecto
        useDefaultLocation: () => {
          const defaultLocation: UserLocation = {
            lat: DEFAULT_CENTER[1],
            lng: DEFAULT_CENTER[0],
            accuracy: undefined,
            timestamp: Date.now(),
          };

          set({
            userLocation: defaultLocation,
            center: DEFAULT_CENTER,
            locationError: 'Usando ubicación predeterminada (Cancún)',
          });

          get().loadMapData();
        },

        // 🎯 Iniciar seguimiento de ubicación
        startLocationTracking: () => {
          const { locationWatchId, geolocationSupported } = get();
          
          // Don't start if already tracking or not supported
          if (locationWatchId !== null || !geolocationSupported) {
            return;
          }

          const watchId = watchUserLocation(
            (location) => {
              get().updateUserLocation(location);
            },
            (error) => {
              console.warn('Location tracking error:', error);
              set({ 
                locationError: error.message,
              });
              
              // Stop tracking on persistent errors
              if (error.message.includes('denegado')) {
                get().stopLocationTracking();
              }
            }
          );

          set({ locationWatchId: watchId });
        },

        // ⏹️ Detener seguimiento de ubicación
        stopLocationTracking: () => {
          const { locationWatchId } = get();
          if (locationWatchId !== null) {
            stopWatchingLocation(locationWatchId);
            set({ locationWatchId: null });
          }
        },

        // 📍 Actualizar ubicación del usuario
        updateUserLocation: (location: UserLocation) => {
          const prevLocation = get().userLocation;
          
          // Only update if location changed significantly (> 10m)
          if (prevLocation) {
            const distance = Math.sqrt(
              Math.pow((location.lat - prevLocation.lat) * 111000, 2) +
              Math.pow((location.lng - prevLocation.lng) * 111000, 2)
            );
            
            if (distance < 10) {
              return; // Skip insignificant changes
            }
          }

          set({ userLocation: location });

          const currentZone = getCurrentZone(location, get().zones);
          set({ currentZone });

          if (get().followUserLocation) {
            set({ center: [location.lng, location.lat] });
          }

          get().loadNearbyMarkers();
        },

        // 🎯 Seleccionar zona
        setSelectedZone: (zone: Zone | null) => {
          set({ selectedZone: zone, selectedMarker: null });

          if (zone && zone.coordinates.length > 0) {
            const firstCoord = zone.coordinates[0];
            if (firstCoord) {
              set({
                center: [firstCoord[0], firstCoord[1]],
                zoom: 14,
                followUserLocation: false,
              });
            }
          }
        },

        // 🎯 Seleccionar marcador
        setSelectedMarker: (marker: Marker | null) => {
          set({ selectedMarker: marker, selectedZone: null });

          if (marker) {
            set({
              center: [marker.lng, marker.lat],
              zoom: 16,
              followUserLocation: false,
            });
          }
        },

        // ❤️ Toggle favorito
        toggleFavorite: async (markerId: number) => {
          try {
            const isFavorite = await toggleFavoriteMarkerUseCase.execute(markerId);

            set((state) => ({
              markers: state.markers.map((m) =>
                m.id === markerId ? { ...m, isFavorite } : m
              ),
              nearbyMarkers: state.nearbyMarkers.map((m) =>
                m.id === markerId ? { ...m, isFavorite } : m
              ),
              selectedMarker:
                state.selectedMarker?.id === markerId
                  ? { ...state.selectedMarker, isFavorite }
                  : state.selectedMarker,
            }));
          } catch (error: any) {
            console.error('Error toggling favorite:', error);
          }
        },

        // 🔧 Configurar filtros
        setFilters: (filters: MapFilters) => {
          set({ filters });
          get().loadMapData();
        },

        // 🔧 Resetear filtros
        resetFilters: () => {
          set({ filters: {} });
          get().loadMapData();
        },

        // ✅ Marcar mapa como cargado
        setMapLoaded: (loaded: boolean) => {
          set({ mapLoaded: loaded });
        },

        // 📍 Configurar centro del mapa
        setCenter: (center: [number, number]) => {
          const currentCenter = get().center;
          const changed =
            Math.abs(currentCenter[0] - center[0]) > 0.001 ||
            Math.abs(currentCenter[1] - center[1]) > 0.001;

          if (changed) {
            set({ center, followUserLocation: false });
          }
        },

        // 🔍 Configurar zoom
        setZoom: (zoom: number) => {
          const currentZoom = get().zoom;
          if (Math.abs(currentZoom - zoom) > 0.1) {
            set({ zoom });
          }
        },

        // 👁️ Mostrar/ocultar ubicación del usuario
        setShowUserLocation: (show: boolean) => {
          set({ showUserLocation: show });
        },

        // 🎯 Seguir ubicación del usuario
        setFollowUserLocation: (follow: boolean) => {
          set({ followUserLocation: follow });

          if (follow && get().userLocation) {
            const { userLocation } = get();
            set({ center: [userLocation!.lng, userLocation!.lat] });
          }
        },

        // 📍 Mostrar solo cercanos
        setShowNearbyOnly: (show: boolean) => {
          set({ showNearbyOnly: show });
          if (show) {
            set((state) => ({
              filters: { ...state.filters, showOnlyNearby: true },
            }));
          } else {
            set((state) => {
              const { showOnlyNearby, ...rest } = state.filters;
              return { filters: rest };
            });
          }
          get().loadMapData();
        },

        // 🔧 Configurar proximidad
        setProximitySettings: (settings: Partial<ProximitySettings>) => {
          set((state) => ({
            proximitySettings: { ...state.proximitySettings, ...settings },
          }));
          get().loadNearbyMarkers();
        },

        // 🧹 Limpiar error
        clearError: () => {
          set({ error: null });
        },

        // 🧹 Limpiar error de ubicación
        clearLocationError: () => {
          set({ locationError: null });
        },

        // 🔄 Resetear estado
        reset: () => {
          get().stopLocationTracking();
          set(initialState);
        },
      }),
      {
        name: 'map-storage',
        partialize: (state) => ({
          filters: state.filters,
          proximitySettings: state.proximitySettings,
          showUserLocation: state.showUserLocation,
          followUserLocation: state.followUserLocation,
          showNearbyOnly: state.showNearbyOnly,
        }),
      }
    ),
    { name: 'MapStore' }
  )
);