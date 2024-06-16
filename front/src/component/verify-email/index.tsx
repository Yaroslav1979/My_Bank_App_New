import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
      <button className="form__button" type="submit">Confirm</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
};

export default VerifyEmail;

