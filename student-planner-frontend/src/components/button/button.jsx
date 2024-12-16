import styles from './button.module.css';
import { PulseLoader } from 'react-spinners';

/**
 * A button component
 * @param {Object} props props
 * @param {string} props.text The text to display on this button
 * @param {function} props.onClick The function to call when this button is clicked
 * @param {string} [props.className] Optional CSS class name
 * @param {boolean | undefined} props.isLoading Indicates whether this button should display a loading state
 * @param {boolean | undefined} props.disabled Indicates whether to disable the onClick event for this button
 * @param {'standard' | 'destructive'} [props.type='standard'] Indicates whether this button is for a normal or destructive action and changes the color palette used accordingly
 * @returns {JSX.Element}
 */
export const Button = props => {
  const {
    text,
    onClick,
    className,
    isLoading,
    disabled,
    type = 'standard',
  } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${type === 'destructive' ? styles.deleteButton : styles.standardButton} ${disabled && styles.disabled} ${className}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? <PulseLoader color='white' /> : text}
    </button>
  );
};
