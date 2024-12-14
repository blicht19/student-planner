import styles from './calendar-page.module.css';
import { useCallback, useMemo, useState } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import { calendarLocalizer } from '../../utils';
import { HourlySchedule } from '../hourly-schedule';
import { Todos } from '../todos';
import { useGetEventsInMonth } from '../../hooks';

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
  const { isLoading, isError, data, isUnauthorized } =
    useGetEventsInMonth(date);

  return (
    <div className={styles.calendarPage}>
      <div className={styles.monthlyCalendar}>
        <h2 className={styles.calendarPageHeading}>Calendar</h2>
        {!(isLoading || isError) && (
          <Calendar
            date={date}
            onNavigate={onNavigate}
            localizer={calendarLocalizer}
            views={[Views.MONTH]}
            defaultView={Views.MONTH}
            onSelectSlot={onSelectSlot}
            selectable
            events={data}
          />
        )}
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
