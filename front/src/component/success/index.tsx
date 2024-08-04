import React, { useState } from 'react';
import "./index.css";
import Modal from '../modal';

const Success: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {showModal && 
        <Modal 
          message="Реєстрація пройшла успішно!" 
          onClose={closeModal} 
          type="success" 
        />
      }
    </div>
  );
};

export default Success;