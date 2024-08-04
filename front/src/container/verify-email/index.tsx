import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormInput from '../../component/input-form';
import Modal from '../../component/modal';
import "./index.css";

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // Додаємо стан для модалки
  const location = useLocation();
  const navigate = useNavigate();

  const email = new URLSearchParams(location.search).get('email');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      setSuccess(result.message);
      setShowModal(true); // Показуємо модалку при успішній верифікації
    } catch (error) {
      setError('Verification failed. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/balance'); // Перенаправлення на сторінку після закриття модалки
  };

  return (
    <Page>
      <div className="head">
        <Title>Confirm account</Title>
        <Subtitle>Write the code you received</Subtitle>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            label="Code"
            type="text"
            name="code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <Button>Confirm</Button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      {showModal && (
        <Modal 
          message="Реєстрація пройшла успішно!" 
          onClose={closeModal} 
          type="success" 
        />
      )}
    </Page>
  );
};

export default VerifyEmail;
