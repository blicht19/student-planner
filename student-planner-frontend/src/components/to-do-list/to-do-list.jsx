import {
  useGetAssignmentsAndTasksFiltered,
  useNavigateToLogin,
} from '../../hooks';
import { MoonLoader } from 'react-spinners';
import { ToDoItem } from './to-do-item.jsx';
import styles from './to-do-list.module.css';
import { useEffect } from 'react';
import { showErrorNotification } from '../../utils';

/**
 * A list of agenda items
 * @param {Object} props props
 * @param {string} props.startDate String representing the start of the range of agenda items to display
 * @param {string} props.endDate String representing the end of the range of agenda items to display
 * @param {boolean} props.showCompleted Indicates whether completed agenda items should be displayed
 * @returns {JSX.Element}
 */
export const ToDoList = props => {
  const { startDate, endDate, showCompleted } = props;
  const { isLoading, isError, data, isUnauthorized } =
    useGetAssignmentsAndTasksFiltered({
      startDate,
      endDate,
      showCompleted,
    });
  const navigateToLogin = useNavigateToLogin();

  useEffect(() => {
    if (isError) {
      if (isUnauthorized) {
        navigateToLogin();
      } else {
        showErrorNotification('Failed to retrieve agenda items');
      }
    }
  }, [isError, isUnauthorized, navigateToLogin]);

  return (
    <div
      className={`${styles.toDoList} ${isLoading && styles.loading} ${isError && styles.error}`}
    >
      {isLoading && <MoonLoader color='var(--light-color)' />}
      {isError && (
        <p className={styles.errorText}>Failed to retrieve agenda items</p>
      )}
      {!(isLoading || isError) &&
        data.map(item => {
          return <ToDoItem key={`${item.type}-${item.id}`} item={item} />;
        })}
    </div>
  );
};
