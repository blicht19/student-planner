import { useGetAssignmentsAndTasksFiltered } from '../../hooks';
import { MoonLoader } from 'react-spinners';
import { ToDoItem } from './to-do-item.jsx';

export const ToDoList = props => {
  const { startDate, endDate, showCompleted } = props;
  const { isLoading, isError, data } = useGetAssignmentsAndTasksFiltered({
    startDate,
    endDate,
    showCompleted,
  });
  return (
    <div>
      {isLoading && <MoonLoader />}
      {isError && <p>Failed to retrieve agenda items</p>}
      {!(isLoading || isError) &&
        data.map(item => {
          return (
            <ToDoItem
              name={item.name}
              complete={item.complete}
              dueDate={item.dueDate}
              note={item.note}
              subject={item.subject}
              id={item.id}
              type={item.type}
              key={`${item.type}-${item.id}`}
            />
          );
        })}
    </div>
  );
};
