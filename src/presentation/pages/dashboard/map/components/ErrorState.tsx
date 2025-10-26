import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-[#0A0A0A] px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="text-red-400" size={32} />
        </div>
        <h3 className="text-xl font-['Playfair_Display'] font-bold text-white mb-2">
          Error al Cargar
        </h3>
        <p className="text-[#E0E0E0]/60 font-['Inter'] text-sm mb-6">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962F] text-[#0A0A0A] rounded-xl font-['Inter'] font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 active:scale-95"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
};