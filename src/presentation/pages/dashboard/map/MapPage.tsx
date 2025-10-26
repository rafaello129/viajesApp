import React from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { useMapPage } from './hooks/useMapPage';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { MobileHeader } from './components/MobileHeader';
import { MobileFilters } from './components/MobileFilters';
import { MobileNearbyDrawer } from './components/MobileNearbyDrawer';
import { MapHeader } from './components/MapHeader';
import { MapStats } from './components/MapStats';
import { MapFilters } from './components/MapFilters';
import MapView from '../../../components/map/MapView';

/**
 * MapPage Component - Mobile First Design
 * Orquestador principal de la página del mapa
 */
export const MapPage: React.FC = () => {
  const {
    zones,
    markers,
    nearbyMarkers,
    filteredNearbyMarkers,
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
  } = useMapPage();

  // Loading State
  if (isLoading && !markers.length) {
    return <LoadingState />;
  }

  // Error State
  if (error && !markers.length) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col bg-[#0A0A0A]">
        <MobileHeader
          nearbyCount={nearbyMarkers.length}
          markersCount={markers.length}
          favoritesCount={favoritesCount}
          isLoading={isLoading}
          isLoadingLocation={isLoadingLocation}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={refreshMapData}
        />

        {showFilters && (
          <MobileFilters
            filters={filters}
            showNearbyOnly={showNearbyOnly}
            onFiltersChange={setFilters}
            onToggleNearbyOnly={() => setShowNearbyOnly(!showNearbyOnly)}
            onReset={resetFilters}
            onApply={() => setShowFilters(false)}
          />
        )}

        <div className="flex-1 relative min-h-0">
          <MapView />

          {nearbyMarkers.length > 0 && !showNearbyList && (
            <button
              onClick={() => setShowNearbyList(true)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#4A90E2] text-white px-6 py-3 rounded-full font-['Inter'] font-semibold shadow-lg active:scale-95 transition-transform z-30 flex items-center gap-2"
            >
              <HiSparkles size={20} />
              <span>Ver {nearbyMarkers.length} lugares cercanos</span>
            </button>
          )}
        </div>

        {showNearbyList && (
          <MobileNearbyDrawer
            markers={filteredNearbyMarkers}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClose={() => setShowNearbyList(false)}
            onSelectMarker={handleSelectMarker}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="w-full h-full space-y-4 animate-fade-in">
      <div>
        <MapHeader
          isLoading={isLoading}
          isLoadingLocation={isLoadingLocation}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onRefresh={refreshMapData}
        />

        <div className="mt-4">
          <MapStats
            markersCount={markers.length}
            nearbyCount={nearbyMarkers.length}
            favoritesCount={favoritesCount}
            zonesCount={zones.length}
          />
        </div>
      </div>

      {showFilters && (
        <MapFilters
          filters={filters}
          showNearbyOnly={showNearbyOnly}
          onFiltersChange={setFilters}
          onToggleNearbyOnly={() => setShowNearbyOnly(!showNearbyOnly)}
          onReset={resetFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div
        className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 320px)', minHeight: '600px' }}
      >
        <MapView />
      </div>
    </div>
  );
};