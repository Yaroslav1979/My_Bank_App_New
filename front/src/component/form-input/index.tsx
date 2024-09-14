import React, { useState } from 'react';
import showPasswordSimbol from '../../svg/eye.svg'; 
import hidePasswordSimbol from '../../svg/hide.svg'; 
import './index.css';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: string;
  disabled?: boolean; 
}

const FormInput: React.FC<FormInputProps> = ({ label, type, name, value, onChange, required = false, icon }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-container">
      <label className="form-container__subtitle">{label}</label>
      <div className="form-container__input-wrapper">
        {icon && <span className="input-icon">{icon}</span>} 
        <input
          className={`form-container__field ${icon ? 'with-icon' : ''}`}
          type={showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
        {type === 'password' && (
          <button
            type="button"
            className="form-container__toggle-button"
            onClick={toggleShowPassword}
          >
            <img 
              src={showPassword ? showPasswordSimbol : hidePasswordSimbol} 
              alt={showPassword ? "Show password" : "Hide password"}
              className="form-container__icon"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;


