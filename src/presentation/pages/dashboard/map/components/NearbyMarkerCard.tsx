import React from 'react';
import { FiNavigation } from 'react-icons/fi';
import type { Marker } from '../../../../../domain/entities';
import { formatDistance } from '../../../../../infrastructure/utils/geolocation.utils';
import { getCategoryIcon } from '../../../../../infrastructure/utils/mapHelpers';

interface NearbyMarkerCardProps {
  marker: Marker;
  onSelect: () => void;
  onToggleFavorite: () => void;
}

export const NearbyMarkerCard: React.FC<NearbyMarkerCardProps> = ({
  marker,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      onClick={onSelect}
      className="bg-[#2A2A2A] rounded-xl p-3 active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8962F] flex items-center justify-center shadow-lg">
          <span className="text-2xl">{getCategoryIcon(marker.category)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-['Inter'] font-semibold text-white text-sm truncate">
              {marker.name}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="flex-shrink-0 text-xl active:scale-110 transition-transform"
            >
              {marker.isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          <p className="text-xs text-[#E0E0E0]/60 font-['Inter'] capitalize mb-2">
            {marker.category}
          </p>

          <div className="flex items-center gap-3">
            {marker.distanceFromUser && (
              <div className="flex items-center gap-1 text-[#4A90E2] text-xs font-['Inter'] font-medium">
                <FiNavigation size={12} />
                <span>{formatDistance(marker.distanceFromUser)}</span>
              </div>
            )}

            {marker.rating && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[#D4AF37]">★</span>
                <span className="text-white font-['Inter'] font-semibold">{marker.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};