import styles from './calendar-page.module.css';
import { useCallback, useMemo, useState } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import { calendarLocalizer } from '../../utils';
import { HourlySchedule } from '../hourly-schedule/index.js';
import { Todos } from '../todos/index.js';

const date = new Date(2024, 11, 14);
const later = new Date(date);
later.setHours(date.getHours() + 1);
const events = [
  {
    id: 1,
    name: 'An event',
    start: date,
    end: later,
  },
];

export const CalendarPage = () => {
  const defaultDate = useMemo(() => {
    return new Date();
  }, []);
  const [date, setDate] = useState(defaultDate);
  const onNavigate = useCallback(newDate => {
    setDate(newDate);
  }, []);
  const onSelectSlot = useCallback(slotInfo => {
    setDate(slotInfo.start);
  }, []);
  const [showHourly, setShowHourly] = useState(true);

  return (
    <div className={styles.calendarPage}>
      <div className={styles.monthlyCalendar}>
        <h2 className={styles.calendarPageHeading}>Calendar</h2>
        <Calendar
          date={date}
          onNavigate={onNavigate}
          localizer={calendarLocalizer}
          views={[Views.MONTH]}
          defaultView={Views.MONTH}
          onSelectSlot={onSelectSlot}
          selectable
          events={events}
        />
      </div>
      <div className={styles.dailySection}>
        <div>
          <label onClick={() => setShowHourly(true)}>Hourly Schedule</label>
          <label
            onClick={() => {
              setShowHourly(false);
            }}
          >
            Agenda
          </label>
        </div>
        {showHourly && <HourlySchedule date={date} />}
        {!showHourly && <Todos date={date} />}
      </div>
    </div>
  );
};
