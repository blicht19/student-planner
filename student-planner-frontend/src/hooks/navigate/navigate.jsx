import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook that provides a function for navigating back to the login page. Primarily to be used if a request comes back with a 401 unauthorized response
 * @returns {(function(): void)|*} Function that navigates the browser to the login page
 */
export const useNavigateToLogin = () => {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate('/login');
  }, [navigate]);
};
