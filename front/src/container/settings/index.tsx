import React, { useState } from 'react';
import FormInput from "../../component/form-input";
import Page from "../../component/page";
import Button from "../../component/button";
import ButtonLogout from "../../component/button-logout"
import { useNavigate } from 'react-router-dom';
import './index.css';

const Settings: React.FC = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    
    if ( !email ) {
      setError("Введіть новий email");
      return;
    }

    if ( !password ) {
      setError("Введіть свій пароль");
      return;
    }

    

    navigate("/confirmation");
  };

  return (
    
    <Page pageTitle="Settings">
      <div>
        <form className="form" onSubmit={handleSubmit}>
        <p className='recieve-subtitle'>Change email</p>
            <div className="form-container">
              <FormInput
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required              
            />

              <FormInput
              label="Old Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required             
            />

          <Button type="submit" className='setting-btn'>Save Email 
          </Button>
          </div>          
          {error && <p className="error">{error}</p>}
        </form>

        <form className="form" onSubmit={handleSubmit}>
        <p className='recieve-subtitle'>Change password</p>
            <div className="form-container">
              <FormInput
              label="Old Password"
              type="password"
              name="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required             
            />

              <FormInput
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required             
            />
          
          <Button type="submit" className='setting-btn'> Save Password             
          </Button>
          </div>

          <ButtonLogout
          //  className='setting-btn setting-btn--red' 
           />    
             {/* Log Out 
          </ButtonLogout>           */}
          {error && <p className="error">{error}</p>}
        </form>

      </div>
    </Page>
    
  );
};

export default Settings;