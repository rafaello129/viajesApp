import React, { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '../../store/useMapStore';
import { LocationAlert } from './LocationAlert';

import { useProgressiveLoading } from './hooks/useProgressiveLoading';
import { useMapController } from './hooks/useMapController';
import { MapControls } from './MapControls';
import { MapOverlays } from './MapOverlays';
import { MobileBottomPanel } from './MobileBottomPanel';

/**
 * MapView Component - Optimizado para evitar parpadeos
 */
const MapView: React.FC = () => {
  const [showMobilePanel, setShowMobilePanel] = useState(false);

  const {
    zones,
    markers,
    nearbyMarkers,
    selectedZone,
    selectedMarker,
    currentZone,
    userLocation,
    showUserLocation,
    followUserLocation,
    showNearbyOnly,
    setSelectedZone,
    setSelectedMarker,
    toggleFavorite,
    requestUserLocation,
    setFollowUserLocation,
    checkLocationSupport,
  } = useMapStore();

  // Check location support on mount
  React.useEffect(() => {
    checkLocationSupport();
  }, [checkLocationSupport]);

  // Progressive marker loading
  const { visibleMarkers, markerAnimationQueue } = useProgressiveLoading(
    markers,
    nearbyMarkers,
    showNearbyOnly,
    userLocation,
    true // Siempre true para que inicie
  );

  // Controlador principal del mapa
  useMapController({
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
  });

  const handleLocationClick = () => {
    if (!userLocation) {
      requestUserLocation();
      return;
    }

    const newFollowState = !followUserLocation;
    setFollowUserLocation(newFollowState);
  };

  return (
    <div className="relative w-full h-full">
      <LocationAlert />

      {/* Map Container - ID fijo para el hook */}
      <div id="map-container" className="absolute inset-0 w-full h-full" />

      {/* Controls */}
      <MapControls
        followUserLocation={followUserLocation}
        userLocation={userLocation}
        onLocationClick={handleLocationClick}
      />

      {/* Overlays */}
      <MapOverlays
        currentZone={currentZone}
        nearbyMarkers={nearbyMarkers}
        userLocation={userLocation}
        visibleMarkers={visibleMarkers}
        markers={markers}
        showMobilePanel={showMobilePanel}
        markerAnimationQueue={markerAnimationQueue.current}
      />

      {/* Mobile Bottom Panel */}
      {showMobilePanel && (selectedMarker || selectedZone) && (
        <MobileBottomPanel
          marker={selectedMarker}
          zone={selectedZone}
          onClose={() => {
            setShowMobilePanel(false);
            setSelectedMarker(null);
            setSelectedZone(null);
          }}
          onToggleFavorite={() => {
            if (selectedMarker) {
              toggleFavorite(selectedMarker.id);
            }
          }}
        />
      )}

      {/* No Token Warning */}
      {!import.meta.env.VITE_MAPBOX_TOKEN && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/95 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg border border-red-400 font-['Inter'] z-[10001] max-w-[90%] text-center">
          <div className="text-sm font-medium">⚠️ Mapbox token no configurado</div>
        </div>
      )}
    </div>
  );
};

export default MapView;