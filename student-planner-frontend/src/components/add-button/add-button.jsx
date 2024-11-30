import { IoAdd } from 'react-icons/io5';
import styles from './add-button.module.css';

export const AddButton = props => {
  const { onClick, className } = props;
  return (
    <button onClick={onClick} className={`${styles.addButton} ${className}`}>
      <IoAdd />
    </button>
  );
};
