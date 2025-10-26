import React from 'react';
import { FiAlertCircle, FiMapPin, FiX } from 'react-icons/fi';
import { useMapStore } from '../../store/useMapStore';

export const LocationAlert: React.FC = () => {
  const { 
    locationError, 
    geolocationSupported,
    requestUserLocation,
    useDefaultLocation,
    clearLocationError,
  } = useMapStore();

  if (!locationError) return null;

  const isDenied = locationError.includes('denegado');
  const isTimeout = locationError.includes('Tiempo') || locationError.includes('Timeout');

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-down">
      <div className="bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
            <FiAlertCircle className="text-[#D4AF37]" size={20} />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-white font-['Inter'] font-semibold text-sm mb-1">
              {isDenied ? 'Ubicación Deshabilitada' : 'Problema de Ubicación'}
            </h4>
            <p className="text-[#E0E0E0]/70 text-xs font-['Inter'] mb-3">
              {locationError}
            </p>

            <div className="flex flex-wrap gap-2">
              {!isDenied && geolocationSupported && (
                <button
                  onClick={() => {
                    clearLocationError();
                    requestUserLocation();
                  }}
                  className="px-3 py-1.5 bg-[#D4AF37] text-[#0A0A0A] rounded-lg text-xs font-['Inter'] font-semibold active:scale-95 transition-transform"
                >
                  Reintentar
                </button>
              )}
              
              <button
                onClick={() => {
                  clearLocationError();
                  useDefaultLocation();
                }}
                className="px-3 py-1.5 bg-[#2A2A2A] text-white rounded-lg text-xs font-['Inter'] font-medium active:scale-95 transition-transform flex items-center gap-1"
              >
                <FiMapPin size={12} />
                Usar Cancún
              </button>
            </div>
          </div>

          <button
            onClick={clearLocationError}
            className="flex-shrink-0 text-[#E0E0E0]/60 hover:text-white transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};