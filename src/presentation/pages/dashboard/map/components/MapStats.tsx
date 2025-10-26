import React from 'react';
import { FiHeart, FiLayers, FiNavigation } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

interface MapStatsProps {
  markersCount: number;
  nearbyCount: number;
  favoritesCount: number;
  zonesCount: number;
}

export const MapStats: React.FC<MapStatsProps> = ({
  markersCount,
  nearbyCount,
  favoritesCount,
  zonesCount,
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard icon={<HiSparkles className="text-[#D4AF37]" size={16} />} value={markersCount} label="Lugares" />
      <StatCard icon={<FiNavigation className="text-[#4A90E2]" size={16} />} value={nearbyCount} label="Cercanos" variant="blue" />
      <StatCard icon={<FiHeart className="text-red-400" size={16} />} value={favoritesCount} label="Favoritos" />
      <StatCard icon={<FiLayers className="text-[#D4AF37]" size={16} />} value={zonesCount} label="Zonas" />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; value: number; label: string; variant?: 'default' | 'blue' }> = ({
  icon,
  value,
  label,
  variant = 'default',
}) => {
  return (
    <div className={`backdrop-blur-sm rounded-xl p-3 border ${
      variant === 'blue' ? 'bg-[#4A90E2]/10 border-[#4A90E2]/30' : 'bg-[#1A1A1A]/50 border-[#2A2A2A]'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xl font-['Playfair_Display'] font-bold text-white">{value}</span>
      </div>
      <p className="text-xs text-[#E0E0E0]/60 font-['Inter']">{label}</p>
    </div>
  );
};