import styles from './modal.module.css';
import { IoClose } from 'react-icons/io5';

export const Modal = props => {
  const { children, onClose } = props;
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.closeButtonContainer}>
          <IoClose onClick={onClose} />
        </div>
        <div className={styles.modalContent}>{children}</div>
      </div>
    </div>
  );
};
