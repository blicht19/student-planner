import styles from './error-text.module.css';

/**
 * Generic component for displaying error text
 * @param {Object} props props
 * @param {string} props.text The text to display
 * @returns {JSX.Element}
 */
export const ErrorText = props => {
  const { text } = props;
  return <p className={styles.errorText}>{text}</p>;
};
