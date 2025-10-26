import React from 'react';
import { FiNavigation } from 'react-icons/fi';

interface MapControlsProps {
  followUserLocation: boolean;
  userLocation: any;
  onLocationClick: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  followUserLocation,
  userLocation,
  onLocationClick,
}) => {
  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-[10000]">
      <button
        onClick={onLocationClick}
        className={`w-11 h-11 rounded-xl backdrop-blur-xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-95 ${
          followUserLocation
            ? 'bg-[#D4AF37] text-[#0A0A0A] border-2 border-[#E5C158]'
            : 'bg-[#1A1A1A]/95 border border-[#2A2A2A] text-white'
        }`}
        title={userLocation ? 'Mi ubicación' : 'Obtener ubicación'}
      >
        <FiNavigation size={18} className={followUserLocation ? 'animate-pulse' : ''} />
      </button>
    </div>
  );
};