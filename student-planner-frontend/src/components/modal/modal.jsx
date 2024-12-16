import styles from './modal.module.css';
import { IoClose } from 'react-icons/io5';

/**
 * A Modal menu component
 * @param children The components that make up the contents of this modal
 * @param {function} closeModal Function for closing the modal
 * @returns {JSX.Element}
 * @constructor
 */
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
