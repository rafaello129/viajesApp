import React from 'react';
import { FiX } from 'react-icons/fi';
import type { MapFilters as IMapFilters } from '../../../../../domain/entities';

interface MapFiltersProps {
  filters: IMapFilters;
  showNearbyOnly: boolean;
  onFiltersChange: (filters: IMapFilters) => void;
  onToggleNearbyOnly: () => void;
  onReset: () => void;
  onClose: () => void;
}

export const MapFilters: React.FC<MapFiltersProps> = ({
  filters,
  showNearbyOnly,
  onFiltersChange,
  onToggleNearbyOnly,
  onReset,
  onClose,
}) => {
  const categories = ['hotel', 'restaurant', 'attraction', 'event', 'villa', 'service'];

  const handleCategoryToggle = (category: string) => {
    const current = filters.markerCategories || [];
    const updated = current.includes(category as any)
      ? current.filter((c) => c !== category)
      : [...current, category as any];
    onFiltersChange({ ...filters, markerCategories: updated });
  };

  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 animate-slide-down">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">Filtros</h3>
        <button
          onClick={onClose}
          className="text-[#E0E0E0]/60 hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-white font-['Inter'] font-medium">Solo lugares cercanos</label>
          <button
            onClick={onToggleNearbyOnly}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              showNearbyOnly ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                showNearbyOnly ? 'translate-x-7' : ''
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-white font-['Inter'] font-medium mb-3 block">Categorías</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-4 py-2 rounded-lg font-['Inter'] text-sm capitalize transition-all duration-300 ${
                  filters.markerCategories?.includes(category as any)
                    ? 'bg-[#D4AF37] text-[#0A0A0A] font-semibold'
                    : 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-[#2A2A2A]">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 bg-[#2A2A2A] text-white rounded-xl font-['Inter'] font-medium hover:bg-[#3A3A3A] transition-all duration-300"
          >
            Limpiar Filtros
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};