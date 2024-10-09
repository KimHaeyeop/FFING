import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1">
      {/* 모달 창 닫기 단추 */}
      <div className="bg-white rounded-lg border-4 border-gray-400 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
