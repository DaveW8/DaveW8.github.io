import { useNavigate } from 'react-router-dom';

const HomeButton = ({styles}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <button 
      style={{
        position: 'absolute',
        zIndex: 1000,
        top: '50px',
        right: '50px',
        fontSize: '20px', 
        fontWeight: 'bold'
      }} 
      onClick={handleGoHome}>
        🏠 Home
    </button>
  );
}

export default HomeButton;
