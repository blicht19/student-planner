import styles from './modal.module.css';
import { IoClose } from 'react-icons/io5';
import { useModalContext } from '../../hooks/index.js';

export const Modal = ({ children }) => {
  const { closeModal } = useModalContext();
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.closeButtonContainer}>
          <IoClose onClick={closeModal} />
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};
