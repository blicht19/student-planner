import { useAuthContext, useModalContext } from '../../hooks';
import { Outlet } from 'react-router-dom';
import styles from './home-page.module.css';
import { Sidebar } from '../sidebar';
import { AddButton } from '../add-button';
import { Modal } from '../modal';
import { ModalContent } from '../modal-content';

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
  const { modalVisible, openNewItemModal } = useModalContext();

  return (
    <div className={styles.homePage}>
      <Sidebar sidebarItems={sidebarItems} />
      <div className={styles.homePageContent}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <AddButton className={styles.add} onClick={openNewItemModal} />
        {modalVisible && (
          <Modal>
            <ModalContent />
          </Modal>
        )}
      </div>
    </div>
  );
};
