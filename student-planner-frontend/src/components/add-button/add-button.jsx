import { IoAdd } from 'react-icons/io5';
import styles from './add-button.module.css';

/**
 * Button for bringing up the modal for adding agenda items.
 * @param {Object} props props
 * @param {function} props.onClick Function called when the button is clicked
 * @param {string} [props.className] Optional CSS class name
 * @returns {JSX.Element}
 */
export const AddButton = props => {
  const { onClick, className } = props;
  return (
    <button onClick={onClick} className={`${styles.addButton} ${className}`}>
      <IoAdd />
    </button>
  );
};
