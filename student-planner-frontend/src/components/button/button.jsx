import styles from './button.module.css';
import { PulseLoader } from 'react-spinners';

export const Button = props => {
  const { text, onClick, className, isLoading, disabled } = props;

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${disabled && styles.disabled} ${className}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? <PulseLoader color='white' /> : text}
    </button>
  );
};
