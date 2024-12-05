import { Filters } from '../to-do-list/filters.jsx';
import { ToDoList } from '../to-do-list';

export const Agenda = () => {
  return (
    <div>
      <div>
        <h2>Agenda Items</h2>
        <Filters />
        <ToDoList
          startDate='11/01/2024'
          endDate='12/31/2024'
          showCompleted={true}
        />
      </div>
      <div>
        <h2>Today&#39;s Schedule</h2>
      </div>
    </div>
  );
};
