import styles from './button.module.css';
import { PulseLoader } from 'react-spinners';

export const Button = props => {
  const { text, onClick, className, isLoading } = props;

  return (
    <button
      onClick={onClick}
      {...props}
      className={`${styles.button} ${className}`}
      disabled={isLoading}
    >
      {isLoading ? <PulseLoader color='white' /> : text}
    </button>
  );
};
