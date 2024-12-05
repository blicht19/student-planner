import { useGetAssignmentsAndTasksFiltered } from '../../hooks';
import { MoonLoader } from 'react-spinners';

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
            <div key={`${item.type}-${item.id}`}>{JSON.stringify(item)}</div>
          );
        })}
    </div>
  );
};
