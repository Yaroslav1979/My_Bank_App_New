import React, { useContext } from 'react';
import { AuthContext } from '../../context/authContext';

const LogoutButton: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    if (authContext) {
      authContext.dispatch({ type: 'LOGOUT' });
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;