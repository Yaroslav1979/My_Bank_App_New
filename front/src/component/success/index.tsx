import React, { useState } from 'react';
import "./index.css";
import Modal from '../modal';

interface SuccessProps {
  message?: string;
}

const Success: React.FC<SuccessProps> = ({ message }) => {
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && message && 
        <Modal 
          message={message} 
          onClose={closeModal} 
          type="success" 
        />
      }
    </div>
  );
};

export default Success;
