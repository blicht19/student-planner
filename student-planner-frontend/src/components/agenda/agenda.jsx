import { useMemo } from 'react';
import { getDateRangeMap } from '../to-do-list/date-range-map.jsx';
import styles from './agenda.module.css';
import { HourlySchedule } from '../hourly-schedule';
import { Todos } from '../todos';

export const Agenda = () => {
  const currentDate = useMemo(() => {
    return new Date();
  }, []);
  useMemo(() => {
    return getDateRangeMap(currentDate);
  }, [currentDate]);
  return (
    <div className={styles.agenda}>
      <div>
        <h2 className={styles.agendaHeading}>Agenda Items</h2>
        <Todos date={currentDate} />
      </div>
      <div className={styles.schedule}>
        <h2 className={styles.agendaHeading}>Today&#39;s Schedule</h2>
        <HourlySchedule date={currentDate} />
      </div>
    </div>
  );
};
