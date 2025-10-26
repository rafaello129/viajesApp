import { useState, useEffect, useMemo } from 'react';
import { useMapStore } from '../../../../store/useMapStore';

export const useMapPage = () => {
  const {
    zones,
    markers,
    nearbyMarkers,
    selectedMarker,
    userLocation,
    filters,
    isLoading,
    isLoadingLocation,
    error,
    showNearbyOnly,
    loadMapData,
    refreshMapData,
    setFilters,
    resetFilters,
    setShowNearbyOnly,
    setSelectedMarker,
    toggleFavorite,
    clearError,
  } = useMapStore();

  const [showFilters, setShowFilters] = useState(false);
  const [showNearbyList, setShowNearbyList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    loadMapData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadMapData]);

  const filteredNearbyMarkers = useMemo(
    () =>
      nearbyMarkers.filter((marker) =>
        marker.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [nearbyMarkers, searchQuery]
  );

  const favoritesCount = useMemo(
    () => markers.filter((m) => m.isFavorite).length,
    [markers]
  );

  const handleRetry = () => {
    clearError();
    loadMapData();
  };

  const handleSelectMarker = (marker: any) => {
    setSelectedMarker(marker);
    setShowNearbyList(false);
  };

  return {
    // State
    zones,
    markers,
    nearbyMarkers,
    filteredNearbyMarkers,
    selectedMarker,
    userLocation,
    filters,
    isLoading,
    isLoadingLocation,
    error,
    showNearbyOnly,
    showFilters,
    showNearbyList,
    searchQuery,
    isMobile,
    favoritesCount,

    // Actions
    setShowFilters,
    setShowNearbyList,
    setSearchQuery,
    refreshMapData,
    setFilters,
    resetFilters,
    setShowNearbyOnly,
    toggleFavorite,
    handleRetry,
    handleSelectMarker,
  };
};