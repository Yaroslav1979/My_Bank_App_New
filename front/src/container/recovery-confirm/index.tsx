import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Page from "../../component/page";
import Button from "../../component/button";
import Title from '../../component/title';
import Subtitle from '../../component/subtitle';
import FormInput from '../../component/form-input';
import { AuthContext } from '../../context/authContext';
import "./index.css";

const RecoveryConfirmPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state as { email: string };
  const authContext = useContext(AuthContext);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isButtonDisabled = !verificationCode || !newPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/recovery-confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      const result = await response.json();
      setSuccess(result.message);

      if (authContext && authContext.dispatch) {
        // Завантаження збереженого балансу користувача
        const userId = result.user.id;
        const balanceKey = `balance_${userId}`;
        const storedBalance = parseFloat(localStorage.getItem(balanceKey) || '0');

        // Завантаження історії подій
        const eventsKey = `userEvents_${userId}`;
        const storedEvents = JSON.parse(localStorage.getItem(eventsKey) || '[]');

        authContext.dispatch({
          type: 'LOGIN',
          payload: {
            token: result.token,
            user: result.user,
            balance: storedBalance,
            userEvents: storedEvents,
          },
        });

        navigate('/balance');
      }
    } catch (error) {
      setError('Password reset failed. Please try again.');
      setVerificationCode('');
      setNewPassword('');
      document.getElementById('verificationCode')?.focus();
    }
  };

  return (
    <Page>
      <div className="head">
        <Title>Recover Password</Title>
        <Subtitle>{'Enter the verification code and set your new password'}</Subtitle>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            // id="verificationCode"
            label="Code"
            type="text"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>

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

        <Button type="submit" disabled={isButtonDisabled}>
          Restore password
        </Button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
    </Page>
  );
};

export default RecoveryConfirmPage;

