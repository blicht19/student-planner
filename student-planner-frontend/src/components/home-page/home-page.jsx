import { useAuthContext } from '../../hooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../hooks';
import styles from './home-page.module.css';
import { Button } from '../button';

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
      <Button
        onClick={logoutMutation.mutate}
        text='Log Out'
        isLoading={logoutMutation.isPending}
      />
    </div>
  );
};
