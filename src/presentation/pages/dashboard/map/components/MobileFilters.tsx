import React from 'react';
import type { MapFilters } from '../../../../../domain/entities';

interface MobileFiltersProps {
  filters: MapFilters;
  showNearbyOnly: boolean;
  onFiltersChange: (filters: MapFilters) => void;
  onToggleNearbyOnly: () => void;
  onReset: () => void;
  onApply: () => void;
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  showNearbyOnly,
  onFiltersChange,
  onToggleNearbyOnly,
  onReset,
  onApply,
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
    <div className="flex-shrink-0 bg-[#1A1A1A] border-b border-[#2A2A2A] animate-slide-down max-h-[40vh] overflow-y-auto relative z-20">
      <div className="p-4 space-y-4">
        {/* Show Nearby Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-white font-['Inter'] font-medium text-sm">Solo cercanos</label>
          <button
            onClick={onToggleNearbyOnly}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              showNearbyOnly ? 'bg-[#D4AF37]' : 'bg-[#2A2A2A]'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                showNearbyOnly ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Categories */}
        <div>
          <label className="text-white font-['Inter'] font-medium text-sm mb-2 block">
            Categorías
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1.5 rounded-lg font-['Inter'] text-xs capitalize transition-all ${
                  filters.markerCategories?.includes(category as any)
                    ? 'bg-[#D4AF37] text-[#0A0A0A] font-semibold'
                    : 'bg-[#2A2A2A] text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 bg-[#2A2A2A] text-white rounded-xl font-['Inter'] text-sm font-medium active:scale-95 transition-transform"
          >
            Limpiar
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] text-sm font-semibold active:scale-95 transition-transform"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};