import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 min-w-85 max-w-lg w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">{title}</h2>
            <button className="text-zinc-400 hover:text-white" onClick={onClose}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
