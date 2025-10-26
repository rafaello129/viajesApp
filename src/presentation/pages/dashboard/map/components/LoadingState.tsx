import React from 'react';
import { FiMapPin } from 'react-icons/fi';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-[#0A0A0A]">
      <div className="text-center px-4">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-[#2A2A2A] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiMapPin className="text-[#D4AF37]" size={28} />
          </div>
        </div>
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
          Explorando el Área
        </h3>
        <p className="text-[#E0E0E0]/60 font-['Inter'] text-sm">
          Cargando lugares cercanos...
        </p>
      </div>
    </div>
  );
};