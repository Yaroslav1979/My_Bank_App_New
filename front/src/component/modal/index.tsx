import React from 'react';
import './index.css';

interface ModalProps {
  message: string;
  onClose: () => void;
  type: 'success' | 'error' | 'info';
}

const Modal: React.FC<ModalProps> = ({ message, onClose, type }) => {
  // Клас модального вікна змінюється в залежності від типу повідомлення
  const modalClass = `modal-content modal-content__${type}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Modal;