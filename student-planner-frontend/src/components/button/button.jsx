import styles from './button.module.css';

export const Button = props => {
  const { text, onClick, className } = props;

  return (
    <button
      onClick={onClick}
      {...props}
      className={`${styles.button} ${className}`}
    >
      {text}
    </button>
  );
};
