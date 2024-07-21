import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import "./index.css";

const VerifyEmail: React.FC = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
      navigate('/success');
      
    } catch (error) {
      setError('Verification failed. Please try again.');
    }
  };

  return (
    <Page>
      <div className="head">     
        <Title>Confirm account</Title>
        <Subtitle> Write the code you received </Subtitle>            
      </div> 
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <label className="form-container__subtitle">Code</label>
          <input
            className="form-container__field"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <Button>Confirm</Button>
        {/* <button className="form__button" type="submit">Confirm</button> */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </Page>
  );
};

export default VerifyEmail;

