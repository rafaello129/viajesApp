import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Marker } from '../../../../domain/entities';
import { adjustColor, formatDistance, getCategoryIcon, getMarkerColor } from '../../../../infrastructure/utils/mapHelpers';

export const useMapMarkers = (
  map: React.RefObject<mapboxgl.Map | null>,
  isMapReady: boolean,
  markers: Marker[],
  nearbyMarkers: Marker[],
  showNearbyOnly: boolean,
  selectedMarker: Marker | null,
  visibleMarkers: Set<number>,
  setSelectedMarker: (marker: Marker | null) => void,
  setShowMobilePanel: (show: boolean) => void
) => {
  const markersRef = useRef<Map<number, mapboxgl.Marker>>(new Map());
  const prevVisibleMarkers = useRef<Set<number>>(new Set());
  const prevSelectedMarkerId = useRef<number | null>(null);

  useEffect(() => {
    if (!map.current || !isMapReady) return;

    const mapInstance = map.current;
    const markersToShow = (showNearbyOnly ? nearbyMarkers : markers).filter((m) =>
      visibleMarkers.has(m.id)
    );

    // Check if visible markers changed
    const visibleChanged = 
      visibleMarkers.size !== prevVisibleMarkers.current.size ||
      Array.from(visibleMarkers).some(id => !prevVisibleMarkers.current.has(id));

    // Check if selection changed
    const selectionChanged = prevSelectedMarkerId.current !== (selectedMarker?.id || null);

    // Only update if something actually changed
    if (!visibleChanged && !selectionChanged) {
      return;
    }

    prevVisibleMarkers.current = new Set(visibleMarkers);
    prevSelectedMarkerId.current = selectedMarker?.id || null;

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

      // Check if marker needs update
      const existingMarker = markersRef.current.get(marker.id);
      if (existingMarker) {
        const needsUpdate = isSelected !== existingMarker.getElement().classList.contains('selected');
        if (!needsUpdate) {
          return; // Marker is up to date
        }
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

        if (map.current) {
          map.current.easeTo({
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
        .addTo(mapInstance);

      markersRef.current.set(marker.id, mapboxMarker);
    });
  }, [isMapReady, visibleMarkers, selectedMarker?.id, showNearbyOnly]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
    };
  }, []);

  return { markersRef };
};