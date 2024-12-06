import { useGetAssignmentsAndTasksFiltered } from '../../hooks';
import { MoonLoader } from 'react-spinners';
import { ToDoItem } from './to-do-item.jsx';
import styles from './to-do-list.module.css';

export const ToDoList = props => {
  const { startDate, endDate, showCompleted } = props;
  const { isLoading, isError, data } = useGetAssignmentsAndTasksFiltered({
    startDate,
    endDate,
    showCompleted,
  });
  return (
    <div
      className={`${styles.toDoList} ${isLoading && styles.loading} ${isError && styles.error}`}
    >
      {isLoading && <MoonLoader />}
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
