import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenicated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenicated) navigate('/');
    },
    [isAuthenicated, navigate]
  );

  return children;
}

export default ProtectedRoute;
