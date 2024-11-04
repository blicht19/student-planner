import { useAuthContext } from '../auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks';

export const HomePage = () => {
  const { username } = useAuthContext();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!username || username.trim() === '') {
      navigate('/login');
    }
  }, [username, navigate]);

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={() => logoutMutation.mutate()}>Log Out</button>
    </div>
  );
};
