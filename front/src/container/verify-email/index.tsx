import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormInput from '../../component/form-input';
import Modal from '../../component/modal';

const VerifyEmail: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const email = location.state?.email || '';
  const isFormValid = verificationCode.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext?.state.token} ?? ''`
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Verification failed');
      }

      const result = await response.json();
      console.log('Token from server:', result.token);

      if (authContext && authContext.dispatch) {
        console.log('Dispatching token:', result.token);

        localStorage.setItem('token', result.token);

        //-------------------------------------------------------------------
        localStorage.setItem('user', JSON.stringify({ email, id: result.id }));
        localStorage.setItem('currentUserId', result.id);
        //---------------------------------------------------------------
        
        authContext.dispatch({
          type: 'LOGIN',
          payload: {
            token: result.token,
            user: { email, id: result.id },
          },
        });

        navigate('/balance');
      } else {
        throw new Error("Authentication context is unavailable.");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/balance');
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
            label="Verification Code"
            type="text"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={!isFormValid}>Confirm</Button>
        {error && <p className="error">{error}</p>}
      </form>
      {showModal && (
        <Modal 
          message="Електронну пошту успішно верифіковано!" 
          onClose={closeModal} 
          type="success" 
        />
      )}
    </Page>
  );
};


export default VerifyEmail;


