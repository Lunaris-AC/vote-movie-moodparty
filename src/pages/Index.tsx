
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/vote');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold mb-4">Redirecting to Movie Vote...</h1>
        </div>
      </div>
    </div>
  );
};

export default Index;
