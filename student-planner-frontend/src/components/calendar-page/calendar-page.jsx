import styles from './calendar-page.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Views } from 'react-big-calendar';
import { calendarLocalizer, showErrorNotification } from '../../utils';
import { HourlySchedule } from '../hourly-schedule';
import { Todos } from '../todos';
import { useGetEventsInMonth, useNavigateToLogin } from '../../hooks';
import { GridLoader } from 'react-spinners';

/**
 * The monthly calendar page
 * @returns {JSX.Element}
 */
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
  const navigateToLogin = useNavigateToLogin();
  useEffect(() => {
    if (isError) {
      if (isUnauthorized) {
        navigateToLogin();
      } else {
        showErrorNotification('Failed to retrieve monthly schedule');
      }
    }
  }, [isError, isUnauthorized, navigateToLogin]);

  return (
    <div className={styles.calendarPage}>
      <div className={styles.monthlyCalendar}>
        <h2 className={styles.calendarPageHeading}>Calendar</h2>
        {isLoading && <GridLoader color='var(--light-color)' />}
        {isError && (
          <p className={styles.errorText}>
            Failed to retrieve monthly schedule
          </p>
        )}
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
        <div className={styles.tabs}>
          <label
            onClick={() => setShowHourly(true)}
            className={`${styles.tab} ${showHourly && styles.active}`}
          >
            Hourly Schedule
          </label>
          <label
            onClick={() => {
              setShowHourly(false);
            }}
            className={`${styles.tab} ${!showHourly && styles.active}`}
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
