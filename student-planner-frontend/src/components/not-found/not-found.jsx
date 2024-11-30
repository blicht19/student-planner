import { Link } from '../link';
import styles from './not-found.module.css';

export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h2>Page Not Found!</h2>
      <Link to='/home/agenda' text='Return Home' />
    </div>
  );
};
