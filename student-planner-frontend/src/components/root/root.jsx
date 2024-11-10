import styles from './root.module.css';
import { Outlet } from 'react-router-dom';

export const Root = () => {
  return (
    <div className={styles.rootLayout}>
      <Outlet />
    </div>
  );
};
