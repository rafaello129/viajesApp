import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Zone } from '../../../../domain/entities';
import { getZoneColor } from '../../../../infrastructure/utils/mapHelpers';

export const useMapZones = (
  map: React.RefObject<mapboxgl.Map | null>,
  isMapReady: boolean,
  zones: Zone[],
  setSelectedZone: (zone: Zone | null) => void,
  setShowMobilePanel: (show: boolean) => void
) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!map.current || !isMapReady || zones.length === 0) return;
    if (hasInitialized.current) return; // IMPORTANTE: Solo inicializar una vez

    const mapInstance = map.current;

    if (!mapInstance.isStyleLoaded()) {
      console.warn('Style not loaded yet, waiting...');
      return;
    }

    try {
      // Remove existing layers (por si acaso)
      if (mapInstance.getLayer('zones-fill')) {
        mapInstance.removeLayer('zones-fill');
      }
      if (mapInstance.getLayer('zones-outline')) {
        mapInstance.removeLayer('zones-outline');
      }
      if (mapInstance.getLayer('zones-selected')) {
        mapInstance.removeLayer('zones-selected');
      }
      if (mapInstance.getSource('zones')) {
        mapInstance.removeSource('zones');
      }

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

      mapInstance.addSource('zones', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: geojsonFeatures,
        },
      });

      mapInstance.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.2,
        },
      });

      mapInstance.addLayer({
        id: 'zones-outline',
        type: 'line',
        source: 'zones',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-opacity': 0.6,
        },
      });

      mapInstance.addLayer({
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
          mapInstance.setFilter('zones-selected', ['==', ['get', 'id'], zone.id]);
        }
      };

      mapInstance.on('click', 'zones-fill', handleZoneClick);

      hasInitialized.current = true;

      // Cleanup
      return () => {
        mapInstance.off('click', 'zones-fill', handleZoneClick);
      };
    } catch (error) {
      console.error('Error adding zones:', error);
    }
  }, [isMapReady, zones.length]); // SOLO depende de isMapReady y cantidad de zones

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      hasInitialized.current = false;
    };
  }, []);
};