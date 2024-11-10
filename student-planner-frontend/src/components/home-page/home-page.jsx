import { useAuthContext } from '../../hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks';
import styles from './home-page.module.css';

export const HomePage = () => {
  const { username, userId } = useAuthContext();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!username || username.trim() === '' || userId == null) {
      navigate('/login');
    }
  }, [username, navigate, userId]);

  return (
    <div className={styles.homePage}>
      <h1>Welcome, {username}</h1>
      <p>Your user ID is {userId}</p>
      <button onClick={() => logoutMutation.mutate()}>Log Out</button>
    </div>
  );
};
