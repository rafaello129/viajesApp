import React, { useState } from 'react';
import { FiNavigation, FiX } from 'react-icons/fi';
import { formatDistance } from '../../../infrastructure/utils/geolocation.utils';
import { getCategoryIcon, getZoneColor } from '../../../infrastructure/utils/mapHelpers';

interface MobileBottomPanelProps {
  marker: any;
  zone: any;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({
  marker,
  zone,
  onClose,
  onToggleFavorite,
}) => {
  const [isPulledUp, setIsPulledUp] = useState(false);

  return (
    <>
      <div className="absolute inset-0 bg-black/40 z-[9998] animate-fade-in" onClick={onClose} />

      <div
        className={`absolute left-0 right-0 bottom-0 bg-[#1A1A1A] rounded-t-3xl shadow-2xl z-[9999] transition-all duration-300 ${
          isPulledUp ? 'h-[70%]' : 'h-auto max-h-[50%]'
        }`}
      >
        <div className="w-full flex justify-center pt-3 pb-2">
          <button
            onClick={() => setIsPulledUp(!isPulledUp)}
            className="w-12 h-1.5 bg-[#2A2A2A] rounded-full active:bg-[#D4AF37] transition-colors"
          />
        </div>

        <div className="px-4 pb-6 overflow-y-auto max-h-full">
          {marker && <MarkerContent marker={marker} isPulledUp={isPulledUp} onToggleFavorite={onToggleFavorite} onClose={onClose} />}
          {zone && !marker && <ZoneContent zone={zone} onClose={onClose} />}
        </div>
      </div>
    </>
  );
};

const MarkerContent: React.FC<{ marker: any; isPulledUp: boolean; onToggleFavorite: () => void; onClose: () => void }> = ({
  marker,
  isPulledUp,
  onToggleFavorite,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getCategoryIcon(marker.category)}</span>
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">{marker.name}</h3>
          </div>
          <p className="text-sm text-[#E0E0E0]/60 font-['Inter'] capitalize">{marker.category}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onToggleFavorite} className="text-3xl active:scale-110 transition-transform">
            {marker.isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center active:scale-95 transition-transform"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      {marker.rating && (
        <div className="flex items-center gap-2 bg-[#D4AF37]/10 rounded-xl px-3 py-2 border border-[#D4AF37]/20">
          <span className="text-[#D4AF37] text-2xl">★</span>
          <span className="text-white font-['Inter'] font-bold text-lg">{marker.rating}</span>
          <span className="text-[#E0E0E0]/60 text-sm font-['Inter']">/ 5.0</span>
        </div>
      )}

      {marker.description && (
        <p className="text-[#E0E0E0] text-sm font-['Inter'] leading-relaxed">{marker.description}</p>
      )}

      {marker.distanceFromUser && (
        <div className="flex items-center gap-2 bg-[#4A90E2]/10 rounded-xl px-3 py-2 border border-[#4A90E2]/20">
          <FiNavigation className="text-[#4A90E2]" size={18} />
          <span className="text-white font-['Inter'] font-semibold">
            {formatDistance(marker.distanceFromUser)}
          </span>
          <span className="text-[#E0E0E0]/60 text-sm font-['Inter']">de distancia</span>
        </div>
      )}

      {marker.priceRange && (
        <div className="flex items-center justify-between bg-[#2A2A2A] rounded-xl px-4 py-3">
          <span className="text-[#E0E0E0]/70 text-sm font-['Inter']">Rango de precio</span>
          <span className="text-[#D4AF37] font-['Inter'] font-semibold capitalize">
            {marker.priceRange.replace('-', ' ')}
          </span>
        </div>
      )}

      {isPulledUp && marker.metadata && (
        <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
          {marker.metadata.address && (
            <div>
              <p className="text-[#E0E0E0]/60 text-xs font-['Inter'] mb-1">Dirección</p>
              <p className="text-white text-sm font-['Inter']">{marker.metadata.address}</p>
            </div>
          )}
          {marker.metadata.phone && (
            <div>
              <p className="text-[#E0E0E0]/60 text-xs font-['Inter'] mb-1">Teléfono</p>
              <a href={`tel:${marker.metadata.phone}`} className="text-[#4A90E2] text-sm font-['Inter'] font-medium">
                {marker.metadata.phone}
              </a>
            </div>
          )}
          {marker.metadata.openingHours && (
            <div>
              <p className="text-[#E0E0E0]/60 text-xs font-['Inter'] mb-1">Horario</p>
              <p className="text-white text-sm font-['Inter']">{marker.metadata.openingHours}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button className="flex-1 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] font-semibold active:scale-95 transition-transform shadow-lg">
          Ver detalles
        </button>
        <button className="px-4 py-3 bg-[#2A2A2A] text-white rounded-xl active:scale-95 transition-transform">
          <FiNavigation size={20} />
        </button>
      </div>
    </div>
  );
};

const ZoneContent: React.FC<{ zone: any; onClose: () => void }> = ({ zone, onClose }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ background: getZoneColor(zone.type) }} />
            <h3 className="text-xl font-['Playfair_Display'] font-bold text-white">{zone.name}</h3>
          </div>
          <p className="text-sm text-[#E0E0E0]/60 font-['Inter'] capitalize">{zone.type}</p>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#2A2A2A] text-white flex items-center justify-center active:scale-95 transition-transform"
        >
          <FiX size={20} />
        </button>
      </div>

      {zone.description && (
        <p className="text-[#E0E0E0] text-sm font-['Inter'] leading-relaxed">{zone.description}</p>
      )}

      {zone.securityLevel && (
        <div className="bg-[#2A2A2A] rounded-xl px-4 py-3">
          <p className="text-[#E0E0E0]/70 text-xs font-['Inter'] mb-2">Nivel de seguridad</p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i < zone.securityLevel ? 'bg-green-500' : 'bg-[#1A1A1A]'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};