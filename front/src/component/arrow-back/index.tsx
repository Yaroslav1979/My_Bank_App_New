import { useNavigate } from 'react-router-dom';
import './index.css';

interface ArrowBackProps {
  children?: React.ReactNode; 
}

const ArrowBack = ({ children }: ArrowBackProps) => {
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