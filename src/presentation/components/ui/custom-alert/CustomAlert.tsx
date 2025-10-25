import { useEffect } from 'react';
import { IoCloseOutline, IoCheckmarkCircle, IoAlertCircle, IoWarning } from 'react-icons/io5';

interface Props {
  message: string;
  onClose: () => void;
  type: 'success' | 'error' | 'warning';
}

export const CustomAlert = ({ message, onClose, type }: Props) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle size={24} />;
      case 'error':
        return <IoAlertCircle size={24} />;
      case 'warning':
        return <IoWarning size={24} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-[#1A1A1A]',
          border: 'border-green-500/30',
          icon: 'text-green-400',
          glow: 'shadow-green-500/20',
        };
      case 'error':
        return {
          bg: 'bg-[#1A1A1A]',
          border: 'border-red-500/30',
          icon: 'text-red-400',
          glow: 'shadow-red-500/20',
        };
      case 'warning':
        return {
          bg: 'bg-[#1A1A1A]',
          border: 'border-[#D4AF37]/30',
          icon: 'text-[#D4AF37]',
          glow: 'shadow-[#D4AF37]/20',
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-auto animate-slide-in-right">
      <div
        className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-xl shadow-2xl ${styles.glow} overflow-hidden`}
      >
        {/* Decorative top border */}
        <div className={`h-1 ${
          type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
          type === 'error' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
          'bg-gradient-to-r from-[#D4AF37] to-[#E5C158]'
        }`} />
        
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`${styles.icon} flex-shrink-0 mt-0.5`}>
            {getIcon()}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-['Inter'] text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-[#E0E0E0]/60 hover:text-white hover:bg-[#2A2A2A] p-1.5 rounded-lg transition-all flex-shrink-0"
            aria-label="Cerrar notificación"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#2A2A2A]">
          <div 
            className={`h-full ${
              type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              'bg-[#D4AF37]'
            } animate-progress-bar`}
            style={{ 
              animation: 'progress 5s linear forwards',
            }}
          />
        </div>
      </div>
    </div>
  );
};