import { useAuthContext } from '../../hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './home-page.module.css';
import { Sidebar } from '../sidebar/index.js';

const sidebarItems = [
  {
    title: 'Agenda',
    path: '/home/agenda',
    id: 'sidebar-agenda',
  },
  {
    title: 'Calendar',
    path: '/home/calendar',
    id: 'sidebar-calendar',
  },
];

export const HomePage = () => {
  const { username, userId } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || username.trim() === '' || userId == null) {
      navigate('/login');
    }
  }, [username, navigate, userId]);

  return (
    <div className={styles.homePage}>
      <Sidebar sidebarItems={sidebarItems} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
