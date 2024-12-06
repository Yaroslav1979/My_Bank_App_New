import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormInput from '../../component/form-input';
import "./index.css";

const RecoveryPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const isFormValid = email.trim() !== '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log("Submitting form with email:", email); 

    try {
      const response = await fetch('http://localhost:4000/recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Email not found');
      }

      const result = await response.json();
      console.log('Success:', result);
      setSuccess(result.message);
      navigate('/recovery-confirm', { state: { email } }); 
    } catch (error) {
      console.error('Error:', error); 
      setError('Email not found. Please try again.');
    }
  };

  return (
    <Page>
      <div className="head">     
        <Title>Recover Password</Title>
        <Subtitle>Choose a recovery method</Subtitle>
      </div> 
      
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={!isFormValid}>Send Code</Button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </Page>
  );
};

export default RecoveryPage;