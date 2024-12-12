import { Filters } from '../to-do-list/filters.jsx';
import { ToDoList } from '../to-do-list';
import { useMemo, useState } from 'react';
import { useToggle } from '../../hooks';
import { getDateRangeMap } from '../to-do-list/date-range-map.jsx';
import styles from './agenda.module.css';

export const Agenda = () => {
  const [dateRange, setDateRange] = useState('Next 7 Days');
  const [showCompleted, toggleShowCompleted] = useToggle(false);
  const dateRangeMap = useMemo(() => {
    return getDateRangeMap();
  }, []);
  const [startDate, endDate] = useMemo(() => {
    return dateRangeMap[dateRange];
  }, [dateRange, dateRangeMap]);

  return (
    <div className={styles.agenda}>
      <div>
        <h2 className={styles.agendaHeading}>Agenda Items</h2>
        <Filters
          dateRange={dateRange}
          setDateRange={setDateRange}
          showCompleted={showCompleted}
          toggleShowCompleted={toggleShowCompleted}
        />
        <ToDoList
          startDate={startDate}
          endDate={endDate}
          showCompleted={showCompleted}
        />
      </div>
      <div>
        <h2 className={styles.agendaHeading}>Today&#39;s Schedule</h2>
      </div>
    </div>
  );
};
