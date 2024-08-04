import { useNavigate } from 'react-router-dom';
import './index.css';

const ArrowBack = ({ children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (    
      <button onClick={handleBack} className="arrow">
        {children}
      </button>    
  );
};

export default ArrowBack;