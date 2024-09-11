import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const LogoutButton: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (authContext) {
      authContext.dispatch({ type: 'LOGOUT' });
      navigate('/');
    }
  };

  return <button className='form__button setting-btn setting-btn--red' onClick={handleLogout}>Log Out</button>;
};

export default LogoutButton;