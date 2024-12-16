import { useLogout, useToggle } from '../../hooks';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import styles from './sidebar.module.css';

/**
 * Sidebar that allows users to navigate between the pages of the application. Based on a tutorial by Dinithi Nethmini https://medium.com/@dinithinethmini01/how-to-build-a-sidebar-component-in-react-abcf471f449e
 * @param {Object} props props
 * @param {Object[]} props.sidebarItems List of options to display in the sidebar
 * @returns {JSX.Element}
 * @constructor
 */
export const Sidebar = props => {
  const { sidebarItems } = props;
  const [showSidebar, toggleSidebar] = useToggle(false);
  const logoutMutation = useLogout();

  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.topBar}>
        <Link to='#' className={styles.barsIcon}>
          <FaBars onClick={toggleSidebar} />
        </Link>
      </div>
      <nav
        className={
          showSidebar
            ? `${styles.sidebar} ${styles.active}`
            : `${styles.sidebar}`
        }
      >
        <div className={styles.sidebarItems}>
          <li className={styles.sidebarToggle} onClick={toggleSidebar}>
            <Link to='#' className={styles.xIcon}>
              <IoClose />
            </Link>
          </li>
          {sidebarItems.map(item => {
            return (
              <li
                onClick={toggleSidebar}
                key={item.id}
                className={styles.sidebarText}
                id={item.id}
              >
                <Link to={item.path}>{item.title}</Link>
              </li>
            );
          })}
          <li className={styles.logoutText} onClick={logoutMutation.mutate}>
            Log Out
          </li>
        </div>
      </nav>
    </div>
  );
};
