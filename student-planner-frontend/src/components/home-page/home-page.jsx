import { useAuthContext, useModalContext } from '../../hooks';
import { Outlet } from 'react-router-dom';
import styles from './home-page.module.css';
import { Sidebar } from '../sidebar';
import { AddButton } from '../add-button';
import { Modal } from '../modal';
import { ModalContent } from '../modal-content';
import { useMemo } from 'react';
import { roles } from '../../constants.js';

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

const adminSidebarItems = [
  ...sidebarItems,
  { title: 'Admin', path: '/home/admin', id: 'sidebar-admin' },
];

/**
 * Wraps all the separate pages of the application
 * @returns {JSX.Element}
 * @constructor
 */
export const HomePage = () => {
  const { modalVisible, openNewItemModal, closeModal } = useModalContext();
  const { role } = useAuthContext();

  const sidebarOptions = useMemo(() => {
    return role === roles.admin ? adminSidebarItems : sidebarItems;
  }, [role]);

  return (
    <div className={styles.homePage}>
      <Sidebar sidebarItems={sidebarOptions} />
      <div className={styles.homePageContent}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <AddButton className={styles.add} onClick={openNewItemModal} />
        {modalVisible && (
          <Modal closeModal={closeModal}>
            <ModalContent />
          </Modal>
        )}
      </div>
    </div>
  );
};
