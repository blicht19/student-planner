import styles from './error-text.module.css';

export const ErrorText = props => {
  const { text } = props;
  return <p className={styles.errorText}>{text}</p>;
};
