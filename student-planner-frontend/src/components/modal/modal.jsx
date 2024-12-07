import styles from './modal.module.css';
import { IoClose } from 'react-icons/io5';

export const Modal = ({ children, closeModal }) => {
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
