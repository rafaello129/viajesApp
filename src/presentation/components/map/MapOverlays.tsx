import React from 'react';
import { HiSparkles } from 'react-icons/hi2';
import { getZoneColor } from '../../../infrastructure/utils/mapHelpers';

interface MapOverlaysProps {
  currentZone: any;
  nearbyMarkers: any[];
  userLocation: any;
  visibleMarkers: Set<number>;
  markers: any[];
  showMobilePanel: boolean;
  markerAnimationQueue: number[];
}

export const MapOverlays: React.FC<MapOverlaysProps> = ({
  currentZone,
  nearbyMarkers,
  userLocation,
  visibleMarkers,
  markers,
  showMobilePanel,
  markerAnimationQueue,
}) => {
  return (
    <>
      {/* Current Zone Badge */}
      {currentZone && (
        <div className="absolute top-3 left-3 z-[10000] max-w-[60%]">
          <div className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-lg border border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: getZoneColor(currentZone.type) }}
              />
              <p className="text-white font-['Inter'] font-semibold text-xs truncate">
                {currentZone.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nearby Counter */}
      {nearbyMarkers.length > 0 && !showMobilePanel && (
        <div className="absolute top-16 left-3 z-[10000]">
          <div className="bg-[#4A90E2]/95 backdrop-blur-xl rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 animate-bounce-slow">
            <HiSparkles className="text-white" size={16} />
            <div className="flex items-baseline gap-1">
              <span className="text-white font-['Inter'] font-bold text-lg leading-none">
                {nearbyMarkers.length}
              </span>
              <span className="text-white/90 text-[10px] font-['Inter'] font-medium">
                cercanos
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Progress */}
      {markerAnimationQueue.length > 0 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[10000]">
          <div className="bg-[#1A1A1A]/95 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg border border-[#2A2A2A] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4A90E2] animate-pulse" />
            <span className="text-white text-xs font-['Inter']">Cargando lugares...</span>
          </div>
        </div>
      )}

      {/* Bottom Stats Bar */}
      {userLocation && !showMobilePanel && (
        <div className="absolute bottom-3 left-3 right-3 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-[#2A2A2A] z-[10000]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-pulse" />
              <span className="text-white font-['Inter'] font-medium">En vivo</span>
              {userLocation.accuracy && (
                <span className="text-[#E0E0E0]/60 font-['Inter']">
                  • {Math.round(userLocation.accuracy)}m
                </span>
              )}
            </div>
            <span className="text-[#E0E0E0]/60 font-['Inter']">
              {visibleMarkers.size}/{markers.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
};