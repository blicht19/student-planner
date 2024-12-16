import { Link } from '../link';
import styles from './not-found.module.css';

/**
 * 404 Not Found page
 * @returns {JSX.Element}
 * @constructor
 */
export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h2>Page Not Found!</h2>
      <Link to='/home/agenda' text='Return Home' />
    </div>
  );
};
