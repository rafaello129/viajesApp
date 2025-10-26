import React from 'react';
import { FiFilter, FiMapPin, FiRefreshCw } from 'react-icons/fi';

interface MapHeaderProps {
  isLoading: boolean;
  isLoadingLocation: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  onRefresh: () => void;
}

export const MapHeader: React.FC<MapHeaderProps> = ({
  isLoading,
  isLoadingLocation,
  showFilters,
  onToggleFilters,
  onRefresh,
}) => {
  return (
    <div className="bg-gradient-to-r from-[#1A1A1A] via-[#1E3A5F]/20 to-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 blur-3xl rounded-full" />

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <FiMapPin className="text-[#0A0A0A]" size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-['Playfair_Display'] font-bold text-white">
                Explorar Mapa
              </h1>
              <p className="text-[#E0E0E0]/70 font-['Inter'] text-sm">
                Descubre lugares exclusivos cerca de ti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleFilters}
              className={`px-4 py-2 rounded-xl font-['Inter'] font-medium flex items-center gap-2 transition-all duration-300 ${
                showFilters
                  ? 'bg-[#D4AF37] text-[#0A0A0A]'
                  : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
              }`}
            >
              <FiFilter size={18} />
              <span>Filtros</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-[#2A2A2A] text-white rounded-xl font-['Inter'] font-medium hover:bg-[#3A3A3A] transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              <FiRefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {isLoadingLocation && (
          <div className="mt-3 flex items-center gap-2 text-[#4A90E2] text-sm font-['Inter']">
            <div className="w-2 h-2 rounded-full bg-[#4A90E2] animate-pulse" />
            <span>Obteniendo ubicación...</span>
          </div>
        )}
      </div>
    </div>
  );
};