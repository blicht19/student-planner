import { useAuthContext, useToggle } from '../../hooks';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './home-page.module.css';
import { Sidebar } from '../sidebar';
import { AddButton } from '../add-button';
import { Modal } from '../modal';

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
  const [showAddModal, toggleShowAddModal] = useToggle(false);

  useEffect(() => {
    if (!username || username.trim() === '' || userId == null) {
      navigate('/login');
    }
  }, [username, navigate, userId]);

  return (
    <div className={styles.homePage}>
      <Sidebar sidebarItems={sidebarItems} />
      <div className={styles.homePageContent}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <AddButton onClick={toggleShowAddModal} className={styles.add} />
        {showAddModal && (
          <Modal onClose={toggleShowAddModal}>Modal content</Modal>
        )}
      </div>
    </div>
  );
};
