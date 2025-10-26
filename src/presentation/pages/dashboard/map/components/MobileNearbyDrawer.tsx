import React from 'react';
import { FiMapPin, FiSearch, FiX } from 'react-icons/fi';
import type { Marker } from '../../../../../domain/entities';
import { NearbyMarkerCard } from './NearbyMarkerCard';

interface MobileNearbyDrawerProps {
  markers: Marker[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClose: () => void;
  onSelectMarker: (marker: Marker) => void;
  onToggleFavorite: (markerId: number) => void;
}

export const MobileNearbyDrawer: React.FC<MobileNearbyDrawerProps> = ({
  markers,
  searchQuery,
  onSearchChange,
  onClose,
  onSelectMarker,
  onToggleFavorite,
}) => {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 bg-[#1A1A1A] rounded-t-3xl shadow-2xl z-50 max-h-[80vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-[#2A2A2A] rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-['Playfair_Display'] font-bold text-white">
              Lugares Cercanos
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#E0E0E0]/40"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar lugares..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl text-white placeholder:text-[#E0E0E0]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 font-['Inter'] text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {markers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#2A2A2A] flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-[#E0E0E0]/40" size={28} />
              </div>
              <p className="text-[#E0E0E0]/60 font-['Inter'] text-sm">
                No se encontraron lugares
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {markers.map((marker) => (
                <NearbyMarkerCard
                  key={marker.id}
                  marker={marker}
                  onSelect={() => onSelectMarker(marker)}
                  onToggleFavorite={() => onToggleFavorite(marker.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};