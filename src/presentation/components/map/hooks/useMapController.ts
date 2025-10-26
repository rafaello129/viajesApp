import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Marker, Zone, UserLocation } from '../../../../domain/entities';
import { adjustColor, formatDistance, getCategoryIcon, getMarkerColor, getZoneColor } from '../../../../infrastructure/utils/mapHelpers';

interface UseMapControllerProps {
  zones: Zone[];
  markers: Marker[];
  nearbyMarkers: Marker[];
  showNearbyOnly: boolean;
  selectedMarker: Marker | null;
  userLocation: UserLocation | null;
  showUserLocation: boolean;
  followUserLocation: boolean;
  visibleMarkers: Set<number>;
  setSelectedMarker: (marker: Marker | null) => void;
  setSelectedZone: (zone: Zone | null) => void;
  setShowMobilePanel: (show: boolean) => void;
}

export const useMapController = ({
  zones,
  markers,
  nearbyMarkers,
  showNearbyOnly,
  selectedMarker,
  userLocation,
  showUserLocation,
  followUserLocation,
  visibleMarkers,
  setSelectedMarker,
  setSelectedZone,
  setShowMobilePanel,
}: UseMapControllerProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());
  const [isMapReady, setIsMapReady] = useState(false);

  // Refs para evitar re-renders
  const zonesInitialized = useRef(false);
  const lastUserPosition = useRef<{ lat: number; lng: number } | null>(null);
  const lastVisibleMarkers = useRef<string>('');
  const lastSelectedMarkerId = useRef<number | null>(null);
  const isUserInteracting = useRef(false);
  const userInteractionTimeout = useRef<any>(null);

  // Función para actualizar marcador de usuario
  const updateUserMarker = (map: mapboxgl.Map, location: UserLocation) => {
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([location.lng, location.lat]);
      
      // Update accuracy circle
      if (map.getSource('user-accuracy')) {
        (map.getSource('user-accuracy') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
          },
          properties: {},
        });
      }
    } else {
      // Create marker
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div class="user-marker-outer"></div>
        <div class="user-marker-inner"></div>
      `;

      userMarkerRef.current = new mapboxgl.Marker(el, {
        anchor: 'center',
      })
        .setLngLat([location.lng, location.lat])
        .addTo(map);

      // Add accuracy circle
      if (location.accuracy && location.accuracy < 100 && !map.getSource('user-accuracy')) {
        try {
          const accuracyRadius = Math.min(location.accuracy, 50);
          
          map.addSource('user-accuracy', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [location.lng, location.lat],
              },
              properties: {},
            },
          });

          map.addLayer({
            id: 'user-accuracy-fill',
            type: 'circle',
            source: 'user-accuracy',
            paint: {
              'circle-radius': {
                stops: [[0, 0], [20, accuracyRadius]],
                base: 2,
              },
              'circle-color': '#4A90E2',
              'circle-opacity': 0.15,
            },
          });
        } catch (error) {
          console.warn('Error adding accuracy layer:', error);
        }
      }
    }
  };

  // Función para actualizar marcadores de lugares
  const updateMarkers = (map: mapboxgl.Map) => {
    const markersToShow = (showNearbyOnly ? nearbyMarkers : markers).filter((m) =>
      visibleMarkers.has(m.id)
    );

    // Check if markers changed
    const currentVisibleIds = Array.from(visibleMarkers).sort().join(',');
    const selectedId = selectedMarker?.id || null;
    
    if (
      lastVisibleMarkers.current === currentVisibleIds &&
      lastSelectedMarkerId.current === selectedId
    ) {
      return; // Nothing changed
    }

    lastVisibleMarkers.current = currentVisibleIds;
    lastSelectedMarkerId.current = selectedId;

    // Remove markers that should no longer be visible
    markersRef.current.forEach((marker, id) => {
      if (!visibleMarkers.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // Add or update visible markers
    markersToShow.forEach((marker) => {
      const isNearby = marker.isNearby;
      const isSelected = selectedMarker?.id === marker.id;
      const isFavorite = marker.isFavorite;

      // Check if marker exists and needs update
      const existingMarker = markersRef.current.get(marker.id);
      if (existingMarker) {
        const needsUpdate = isSelected !== existingMarker.getElement().classList.contains('selected');
        if (!needsUpdate) return;
        
        existingMarker.remove();
        markersRef.current.delete(marker.id);
      }

      const el = document.createElement('div');
      el.className = 'alaya-marker-container';

      const markerColor = getMarkerColor(marker.category);
      const markerSize = isSelected ? 56 : isNearby ? 48 : 40;

      el.innerHTML = `
        <div class="alaya-marker ${isNearby ? 'nearby' : ''} ${isSelected ? 'selected' : ''}" 
             style="width: ${markerSize}px; height: ${markerSize}px; background: linear-gradient(135deg, ${markerColor}, ${adjustColor(markerColor, -20)}); border: ${isSelected ? '3px solid #D4AF37' : '3px solid #fff'}; box-shadow: ${isSelected ? '0 6px 20px rgba(212, 175, 55, 0.8)' : '0 4px 12px rgba(0,0,0,0.5)'}, ${isNearby ? '0 0 25px rgba(74, 144, 226, 0.8)' : 'none'};">
          <span style="font-size: ${markerSize / 2.2}px; filter: brightness(0) invert(1);">${getCategoryIcon(marker.category)}</span>
          ${isFavorite ? '<div class="favorite-badge">❤️</div>' : ''}
          ${marker.distanceFromUser && marker.distanceFromUser < 1000 ? `<div class="distance-badge">${formatDistance(marker.distanceFromUser)}</div>` : ''}
        </div>
        ${isNearby ? '<div class="marker-pulse"></div>' : ''}
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedMarker(marker);
        setShowMobilePanel(true);

        if (mapRef.current) {
          mapRef.current.easeTo({
            center: [marker.lng, marker.lat],
            zoom: 17,
            duration: 800,
          });
        }
      });

      const mapboxMarker = new mapboxgl.Marker(el, {
        anchor: 'center',
        offset: [0, 0],
      })
        .setLngLat([marker.lng, marker.lat])
        .addTo(map);

      markersRef.current.set(marker.id, mapboxMarker);
    });
  };

  // Función para inicializar zonas (solo una vez)
  const initializeZones = (map: mapboxgl.Map) => {
    if (zonesInitialized.current || zones.length === 0) return;
    if (!map.isStyleLoaded()) return;

    try {
      const geojsonFeatures = zones.map((zone) => ({
        type: 'Feature' as const,
        properties: {
          id: zone.id,
          name: zone.name,
          type: zone.type,
          description: zone.description || '',
          color: getZoneColor(zone.type),
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [zone.coordinates],
        },
      }));

      map.addSource('zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        },
      });

      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: 'zones-outline',
        type: 'line',
        source: 'zones',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-opacity': 0.6,
        },
      });

      map.addLayer({
        id: 'zones-selected',
        type: 'line',
        source: 'zones',
        paint: {
          'line-color': '#D4AF37',
          'line-width': 3,
        },
        filter: ['==', ['get', 'id'], ''],
      });

      const handleZoneClick = (e: mapboxgl.MapLayerMouseEvent) => {
        if (!e.features || e.features.length === 0) return;

        const feature = e.features[0];
        const zone = zones.find((z) => z.id === feature.properties?.id);

        if (zone) {
          setSelectedZone(zone);
          setShowMobilePanel(true);
          map.setFilter('zones-selected', ['==', ['get', 'id'], zone.id]);
        }
      };

      map.on('click', 'zones-fill', handleZoneClick);

      zonesInitialized.current = true;
    } catch (error) {
      console.error('Error adding zones:', error);
    }
  };

  // Effect principal: Inicializar mapa (SOLO UNA VEZ)
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: userLocation ? [userLocation.lng, userLocation.lat] : [-86.8515, 21.1619],
      zoom: userLocation ? 15 : 13,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
      touchZoomRotate: true,
      touchPitch: false,
      dragRotate: false,
      pitchWithRotate: false,
    });

    map.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: '© ALAYA',
      }),
      'bottom-left'
    );

    const handleInteractionStart = () => {
      isUserInteracting.current = true;
      if (userInteractionTimeout.current) {
        clearTimeout(userInteractionTimeout.current);
      }
    };

    const handleInteractionEnd = () => {
      userInteractionTimeout.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 2000);
    };

    map.on('load', () => {
      setIsMapReady(true);
      mapRef.current = map;
    });

    map.on('touchstart', handleInteractionStart);
    map.on('mousedown', handleInteractionStart);
    map.on('movestart', (e) => {
      if (e.originalEvent) handleInteractionStart();
    });
    map.on('moveend', handleInteractionEnd);

    return () => {
      if (userInteractionTimeout.current) {
        clearTimeout(userInteractionTimeout.current);
      }
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      markersRef.current.forEach((marker) => marker.remove());
      map.remove();
    };
  }, []); // SOLO se ejecuta una vez

  // Effect: Actualizar cuando cambian datos relevantes
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const map = mapRef.current;

    // Initialize zones (only once)
    initializeZones(map);

    // Update user marker
    if (userLocation && showUserLocation) {
      updateUserMarker(map, userLocation);

      // Follow user if enabled
      if (followUserLocation && !isUserInteracting.current) {
        const lastPos = lastUserPosition.current;
        if (!lastPos || 
            Math.abs(lastPos.lat - userLocation.lat) > 0.0001 ||
            Math.abs(lastPos.lng - userLocation.lng) > 0.0001) {
          
          map.easeTo({
            center: [userLocation.lng, userLocation.lat],
            zoom: 16,
            duration: 1000,
          });
          
          lastUserPosition.current = { lat: userLocation.lat, lng: userLocation.lng };
        }
      }
    }

    // Update markers
    updateMarkers(map);
  }, [
    isMapReady,
    userLocation?.lat,
    userLocation?.lng,
    showUserLocation,
    followUserLocation,
    visibleMarkers,
    selectedMarker?.id,
    showNearbyOnly,
  ]); // Solo dependencias esenciales

  return {
    isMapReady,
    isUserInteracting,
  };
};