import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { UserLocation } from '../../../../domain/entities';

export const useUserLocationMarker = (
  map: React.RefObject<mapboxgl.Map | null>,
  isMapReady: boolean,
  userLocation: UserLocation | null,
  showUserLocation: boolean,
  followUserLocation: boolean
) => {
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const hasInitialized = useRef(false);
  const lastPosition = useRef<{ lat: number; lng: number } | null>(null);

  // Update map position when following user (SOLO si cambió la posición significativamente)
  useEffect(() => {
    if (!map.current || !isMapReady || !followUserLocation || !userLocation) {
      return;
    }

    // Check if position changed significantly (more than 10 meters)
    if (lastPosition.current) {
      const distance = Math.sqrt(
        Math.pow((userLocation.lat - lastPosition.current.lat) * 111000, 2) +
        Math.pow((userLocation.lng - lastPosition.current.lng) * 111000, 2)
      );
      
      if (distance < 10) {
        return; // Skip if movement is less than 10m
      }
    }

    lastPosition.current = { lat: userLocation.lat, lng: userLocation.lng };

    map.current.easeTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 16,
      duration: 1000,
    });
  }, [isMapReady, followUserLocation, userLocation?.lat, userLocation?.lng]);

  // Render user location marker (SOLO cuando cambian valores relevantes)
  useEffect(() => {
    if (!map.current || !isMapReady) {
      return;
    }

    const mapInstance = map.current;

    // Remove marker if conditions not met
    if (!userLocation || !showUserLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
        hasInitialized.current = false;
      }
      return;
    }

    // Update existing marker position (NO recrear el marcador)
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      
      // Update accuracy circle if exists
      if (mapInstance.getSource('user-accuracy') && userLocation.accuracy && userLocation.accuracy < 100) {
        (mapInstance.getSource('user-accuracy') as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [userLocation.lng, userLocation.lat],
          },
          properties: {},
        });
      }
      return;
    }

    // Create marker ONLY ONCE
    if (!hasInitialized.current) {
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.innerHTML = `
        <div class="user-marker-outer"></div>
        <div class="user-marker-inner"></div>
      `;

      userMarkerRef.current = new mapboxgl.Marker(el, {
        anchor: 'center',
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapInstance);

      // Add accuracy circle ONLY ONCE
      if (userLocation.accuracy && userLocation.accuracy < 100) {
        const accuracyRadius = Math.min(userLocation.accuracy, 50);

        try {
          if (!mapInstance.getSource('user-accuracy')) {
            mapInstance.addSource('user-accuracy', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [userLocation.lng, userLocation.lat],
                },
                properties: {},
              },
            });

            mapInstance.addLayer({
              id: 'user-accuracy-fill',
              type: 'circle',
              source: 'user-accuracy',
              paint: {
                'circle-radius': {
                  stops: [
                    [0, 0],
                    [20, accuracyRadius],
                  ],
                  base: 2,
                },
                'circle-color': '#4A90E2',
                'circle-opacity': 0.15,
              },
            });
          }
        } catch (error) {
          console.warn('Error adding accuracy layer:', error);
        }
      }

      hasInitialized.current = true;
    }
  }, [isMapReady, userLocation?.lat, userLocation?.lng, showUserLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      hasInitialized.current = false;
    };
  }, []);

  return { userMarkerRef };
};