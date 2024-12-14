import { Filters } from '../to-do-list/filters.jsx';
import { ToDoList } from '../to-do-list';
import { useMemo, useState } from 'react';
import { useToggle } from '../../hooks';
import { getDateRangeMap } from '../to-do-list/date-range-map.jsx';
import styles from './agenda.module.css';
import { HourlySchedule } from '../hourly-schedule';

export const Agenda = () => {
  const [dateRange, setDateRange] = useState('Next 7 Days');
  const [showCompleted, toggleShowCompleted] = useToggle(false);
  const dateRangeMap = useMemo(() => {
    return getDateRangeMap();
  }, []);
  const [startDate, endDate] = useMemo(() => {
    return dateRangeMap[dateRange];
  }, [dateRange, dateRangeMap]);
  const currentDate = useMemo(() => {
    return new Date();
  }, []);

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
      <div className={styles.schedule}>
        <h2 className={styles.agendaHeading}>Today&#39;s Schedule</h2>
        <HourlySchedule date={currentDate} />
      </div>
    </div>
  );
};
