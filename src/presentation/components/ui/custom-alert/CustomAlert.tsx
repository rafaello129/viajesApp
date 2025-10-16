
import { useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

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

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs w-auto">
      <div
        className={`${
          type === 'success'
            ? 'bg-green-600'
            : type === 'error'
            ? 'bg-red-600'
            : 'bg-yellow-600'
        } text-white p-4 flex items-center justify-between rounded-lg shadow-lg`}
      >
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 ml-4"
        >
          <IoCloseOutline />
        </button>
      </div>
    </div>
  );
};
