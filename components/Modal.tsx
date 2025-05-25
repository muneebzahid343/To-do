
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className={`${theme.cardBg} ${theme.textColor} p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out scale-95 animate-modalOpen`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-20 hover:${theme.secondaryBg} transition-colors`}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
      {/* 
        Removed <style jsx global> block as it's not standard React and causes TypeScript errors.
        The animation 'modalOpen' and class '.animate-modalOpen' should be defined in a global CSS file.
        Example CSS for a global stylesheet (e.g., index.css):
        @keyframes modalOpen {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modalOpen {
          animation: modalOpen 0.3s ease-out forwards;
        }
      */}
    </div>
  );
};

export default Modal;