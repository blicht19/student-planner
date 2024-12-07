import styles from './error-fallback.module.css';

export const ErrorFallback = () => {
  return (
    <div className={styles.errorFallback}>
      <h2>An error occurred</h2>
      <a href='/home/agenda' className={styles.errorFallbackLink}>
        Return Home
      </a>
    </div>
  );
};
