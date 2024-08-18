import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../form-input';
import Button from "../button";
import "./index.css";

interface RegisterFormProps {
  onError: (message: string) => void;
  children?: React.ReactNode; // Додано пропс для children
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onError, children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/user-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Registration failed');
      }

      const result = await response.json();
      console.log(result.message);

      // Направлення користувача на сторінку верифікації з передачею email
      navigate('/verify-email', { state: { email } });
    } catch (error) {
      onError((error as Error).message);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-container">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            // placeholder="Enter your email"
          />
        </div>
        <div className="form-container">
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            // placeholder="Enter your password"
          />
        </div>
        <Button type="submit">Continue</Button>
        {error && <p className="error">{error}</p>}
      </form>
      {children} {/* Додано підтримку children */}
    </div>
  );
};

export default RegisterForm;