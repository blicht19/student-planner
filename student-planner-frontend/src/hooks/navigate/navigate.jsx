import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useNavigateToLogin = () => {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate('/login');
  }, [navigate]);
};
