import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormInput from '../../component/input-form';
import Modal from '../../component/modal'; 
import "./index.css";

const RecoveryConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state as { email: string };

  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordActive, setIsPasswordActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isPasswordActive) {
      try {
        const response = await fetch('http://localhost:4000/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationCode }),
        });

        if (!response.ok) {
          throw new Error('Invalid verification code');
        }

        const result = await response.json();
        setSuccess(result.message);
        setIsPasswordActive(true);
      } catch (error) {
        setError('Invalid verification code. Please try again.');
      }
    } else {
      try {
        const response = await fetch('http://localhost:4000/recovery-confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verificationCode, newPassword }),
        });

        if (!response.ok) {
          throw new Error('Password reset failed');
        }

        const result = await response.json();
        setSuccess(result.message);
        navigate('/balance');
      } catch (error) {
        setError('Password reset failed. Please try again.');
      }
    }
  };

  return (
    <Page>
      <div className="head">     
        <Title>Recover Password</Title>
        <Subtitle>{isPasswordActive ? 'Set a new password' : 'Write the code you received'}</Subtitle>
      </div> 
      
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            label="Code"
            type="text"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>

        {isPasswordActive && (
          <div className="form-container">
            <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        )}

        <Button>{isPasswordActive ? 'Restore Password' : 'Verify Code'}</Button>
        
        {error && <Modal message={error} onClose={() => setError(null)} type="error" />}
        {success && !isPasswordActive && <p className="success">{success}</p>}
      </form>
    </Page>
  );
};

export default RecoveryConfirmPage;