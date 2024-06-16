import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const newUser = {
      email: (e.target as any).elements.email.value,
      password: (e.target as any).elements.password.value,
    };

    console.log("newUser:", newUser);

    try {
      const response = await fetch('http://localhost:4000/user-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      setSuccess(result.message);
      navigate(`/verify-email?email=${newUser.email}`);
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} method='POST' action=''>
      <div className="form-container">
        <label className="form-container__subtitle">Email</label>
        <input
          className="form-container__field"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-container">
        <label className="form-container__subtitle">Password</label>
        <input
          className="form-container__field"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className='form-link'>
        <p className='form-link__text'>Already have an account? <a href='.#' className='form-link__link'> Sign In</a> </p>
      </div>
      <button className="form__button" type="submit">Continue</button>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </form>
  );
};

export default RegisterForm;

