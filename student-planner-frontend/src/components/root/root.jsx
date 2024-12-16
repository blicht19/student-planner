import styles from './root.module.css';
import { Outlet } from 'react-router-dom';

/**
 * Root component of the app
 * @returns {JSX.Element}
 * @constructor
 */
export const Root = () => {
  return (
    <div className={styles.rootLayout}>
      <Outlet />
    </div>
  );
};
