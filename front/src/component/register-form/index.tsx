import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../input-form';
import Button from "../button";
// import Modal from '../modal';
import "./index.css";

interface RegisterFormProps {
  onError: (message: string) => void;
  children?: React.ReactNode;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onError, children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const newUser = { email, password };

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
      // setShowModal(true);
      setTimeout(() => {
        navigate(`/verify-email?email=${newUser.email}`);
      }, 2000);
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      setError(errorMessage);
      onError(errorMessage);
    }
  };

  // const closeModal = () => {
  //   setShowModal(false);
  // };

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
          />
        </div>
        <Button>Continue</Button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      {/* {showModal && 
        <Modal 
          message="Registration was successful!" 
          onClose={closeModal} 
          type="success"
        />
      } */}
      {children}
    </div>
  );
};

export default RegisterForm;