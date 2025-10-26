import React from 'react';
import { FiMapPin, FiSliders, FiRefreshCw, FiHeart, FiNavigation } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

interface MobileHeaderProps {
  nearbyCount: number;
  markersCount: number;
  favoritesCount: number;
  isLoading: boolean;
  isLoadingLocation: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  nearbyCount,
  markersCount,
  favoritesCount,
  isLoading,
  isLoadingLocation,
  showFilters,
  onToggleFilters,
  onRefresh,
}) => {
  return (
    <div className="flex-shrink-0 bg-gradient-to-r from-[#1A1A1A] via-[#1E3A5F]/20 to-[#1A1A1A] p-4 border-b border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <FiMapPin className="text-[#0A0A0A]" size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-['Playfair_Display'] font-bold text-white">Explorar</h1>
            <p className="text-xs text-[#E0E0E0]/60 font-['Inter']">{nearbyCount} cercanos</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              showFilters ? 'bg-[#D4AF37] text-[#0A0A0A]' : 'bg-[#2A2A2A] text-white'
            }`}
          >
            <FiSliders size={18} />
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-[#2A2A2A] text-white flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
          >
            <FiRefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <MobileStat icon={<HiSparkles className="text-[#D4AF37]" size={12} />} value={markersCount} label="Lugares" />
        <MobileStat icon={<FiNavigation className="text-[#4A90E2]" size={12} />} value={nearbyCount} label="Cercanos" variant="blue" />
        <MobileStat icon={<FiHeart className="text-red-400" size={12} />} value={favoritesCount} label="Favoritos" />
      </div>

      {isLoadingLocation && (
        <div className="mt-2 flex items-center gap-2 text-[#4A90E2] text-xs font-['Inter']">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] animate-pulse" />
          <span>Obteniendo ubicación...</span>
        </div>
      )}
    </div>
  );
};

const MobileStat: React.FC<{ icon: React.ReactNode; value: number; label: string; variant?: 'default' | 'blue' }> = ({
  icon,
  value,
  label,
  variant = 'default',
}) => {
  return (
    <div className={`backdrop-blur-sm rounded-lg p-2 border ${
      variant === 'blue' ? 'bg-[#4A90E2]/10 border-[#4A90E2]/30' : 'bg-[#1A1A1A]/50 border-[#2A2A2A]'
    }`}>
      <div className="flex items-center gap-1 mb-0.5">
        {icon}
        <span className="text-base font-['Playfair_Display'] font-bold text-white">{value}</span>
      </div>
      <p className="text-[10px] text-[#E0E0E0]/60 font-['Inter']">{label}</p>
    </div>
  );
};