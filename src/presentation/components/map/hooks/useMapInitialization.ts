import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useMapStore } from '../../../store/useMapStore';

export const useMapInitialization = (mapContainer: React.RefObject<HTMLDivElement | null>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const isUserInteracting = useRef(false);
  const userInteractionTimeout = useRef<any>(null);

  const {
    userLocation,
    setMapLoaded,
    setFollowUserLocation,
    requestUserLocation,
    startLocationTracking,
    stopLocationTracking,
    checkLocationSupport,
  } = useMapStore();

  useEffect(() => {
    checkLocationSupport();
  }, [checkLocationSupport]);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token) {
      console.warn('⚠️ Mapbox token not configured');
      return;
    }

    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
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

    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: '© ALAYA',
      }),
      'bottom-left'
    );

    map.current.on('load', () => {
      console.log('Map loaded');
      setIsMapReady(true);
      setMapLoaded(true);
    });

    // User interaction handlers
    const handleInteractionStart = () => {
      isUserInteracting.current = true;
      if (userInteractionTimeout.current) {
        clearTimeout(userInteractionTimeout.current);
      }
    };

    const handleInteractionEnd = () => {
      userInteractionTimeout.current = setTimeout(() => {
        isUserInteracting.current = false;
      }, 1    );
    };

    map.current.on('touchstart', handleInteractionStart);
    map.current.on('mousedown', handleInteractionStart);
    map.current.on('movestart', (e) => {
      if (e.originalEvent) handleInteractionStart();
    });
    map.current.on('moveend', handleInteractionEnd);
    map.current.on('dragstart', () => setFollowUserLocation(false));

    requestUserLocation();
    startLocationTracking();

    return () => {
      stopLocationTracking();
      if (userInteractionTimeout.current) {
        clearTimeout(userInteractionTimeout.current);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      setIsMapReady(false);
    };
  }, []);

  return {
    map,
    isMapReady,
    isUserInteracting,
  };
};