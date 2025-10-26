import { useState, useRef, useEffect } from 'react';
import type { Marker } from '../../../../domain/entities';

export const useProgressiveLoading = (
  markers: Marker[],
  nearbyMarkers: Marker[],
  showNearbyOnly: boolean,
  userLocation: any,
  isMapReady: boolean
) => {
  const [visibleMarkers, setVisibleMarkers] = useState<Set<number>>(new Set());
  const markerAnimationQueue = useRef<number[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const startProgressiveMarkerLoading = () => {
    const markersToShow = showNearbyOnly ? nearbyMarkers : markers;

    if (userLocation) {
      const sortedMarkers = [...markersToShow].sort((a, b) => {
        const distA = a.distanceFromUser || Infinity;
        const distB = b.distanceFromUser || Infinity;
        return distA - distB;
      });
      markerAnimationQueue.current = sortedMarkers.map((m) => m.id);
    } else {
      markerAnimationQueue.current = markersToShow.map((m) => m.id);
    }

    setVisibleMarkers(new Set());
    animateMarkerAppearance();
  };

  const animateMarkerAppearance = () => {
    if (markerAnimationQueue.current.length === 0) return;

    const batchSize = window.innerWidth < 768 ? 2 : 3;
    const batch = markerAnimationQueue.current.splice(0, batchSize);

    setVisibleMarkers((prev) => {
      const newSet = new Set(prev);
      batch.forEach((id) => newSet.add(id));
      return newSet;
    });

    if (markerAnimationQueue.current.length > 0) {
      animationFrameRef.current = window.setTimeout(() => {
        animateMarkerAppearance();
      }, 1);
    }
  };

  useEffect(() => {
    if (isMapReady && markers.length > 0) {
      startProgressiveMarkerLoading();
    }

    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current);
      }
    };
  }, [isMapReady, markers, nearbyMarkers, showNearbyOnly, userLocation]);

  return {
    visibleMarkers,
    markerAnimationQueue,
    startProgressiveMarkerLoading,
  };
};