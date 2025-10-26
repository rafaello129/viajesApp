import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Zone, Marker } from '../../../domain/entities';

interface MapViewProps {
  zones?: Zone[];
  markers?: Marker[];
}

/**
 * MapView Component
 * Renders a Mapbox GL JS map with dark mode styling
 * Displays zones as polygons and markers as points
 */
const MapView: React.FC<MapViewProps> = ({ zones = [], markers = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map on component mount
  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    
    if (!token) {
      console.warn('⚠️ Mapbox token not found. Please add VITE_MAPBOX_TOKEN to your .env file');
      return;
    }

    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = token;

    // Create map centered on Cancún, Mexico
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-86.8515, 21.1619], // Cancún coordinates
      zoom: 12,
    });

    // Set map loaded flag when style loads
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add zones (polygons) to map
  useEffect(() => {
    if (!map.current || !mapLoaded || zones.length === 0) return;

    const mapInstance = map.current;

    // Remove existing zones layer if it exists
    if (mapInstance.getLayer('zones-layer')) {
      mapInstance.removeLayer('zones-layer');
    }
    if (mapInstance.getSource('zones')) {
      mapInstance.removeSource('zones');
    }

    // Create GeoJSON features for zones
    const geojsonFeatures = zones.map((zone) => ({
      type: 'Feature' as const,
      properties: {
        name: zone.name,
        id: zone.id,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [zone.coordinates],
      },
    }));

    // Add zones source
    mapInstance.addSource('zones', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: geojsonFeatures,
      },
    });

    // Add zones fill layer
    mapInstance.addLayer({
      id: 'zones-layer',
      type: 'fill',
      source: 'zones',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.3,
      },
    });

    // Add zones outline layer
    mapInstance.addLayer({
      id: 'zones-outline',
      type: 'line',
      source: 'zones',
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2,
      },
    });

    // Add popup on click
    mapInstance.on('click', 'zones-layer', (e) => {
      if (!e.features || e.features.length === 0) return;
      
      const feature = e.features[0];
      const coordinates = e.lngLat;
      const name = feature.properties?.name || 'Unknown Zone';

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<div style="color: #000;"><strong>${name}</strong></div>`)
        .addTo(mapInstance);
    });

    // Change cursor on hover
    mapInstance.on('mouseenter', 'zones-layer', () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    });

    mapInstance.on('mouseleave', 'zones-layer', () => {
      mapInstance.getCanvas().style.cursor = '';
    });
  }, [zones, mapLoaded]);

  // Add markers to map
  useEffect(() => {
    if (!map.current || !mapLoaded || markers.length === 0) return;

    const mapInstance = map.current;
    const markerElements: mapboxgl.Marker[] = [];

    markers.forEach((marker) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#ef4444';
      el.style.border = '2px solid #fff';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="color: #000;"><strong>${marker.name}</strong></div>`
      );

      // Add marker to map
      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(mapInstance);

      markerElements.push(mapboxMarker);
    });

    // Cleanup markers on unmount or when markers change
    return () => {
      markerElements.forEach((marker) => marker.remove());
    };
  }, [markers, mapLoaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
      {!import.meta.env.VITE_MAPBOX_TOKEN && (
        <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ⚠️ Mapbox token not configured
        </div>
      )}
    </div>
  );
};

export default MapView;
