import { useCallback, useEffect, useMemo } from 'react';
import {
  calendarLocalizer,
  dateFormatter,
  setDateTime,
  showErrorNotification,
} from '../../utils';
import {
  useGetScheduleOnDay,
  useModalContext,
  useNavigateToLogin,
} from '../../hooks';
import { Calendar, Views } from 'react-big-calendar';
import { MoonLoader } from 'react-spinners';
import styles from './hourly-schedule.module.css';

export const HourlySchedule = props => {
  const { date } = props;
  const { openEditModal } = useModalContext();
  const day = useMemo(() => {
    return dateFormatter.format(date);
  }, [date]);
  const { isLoading, isError, data, isUnauthorized } = useGetScheduleOnDay(day);
  const navigateToLogin = useNavigateToLogin();
  useEffect(() => {
    if (isError) {
      if (isUnauthorized) {
        navigateToLogin();
      } else {
        showErrorNotification('Failed to retrieve schedule');
      }
    }
  }, [isError, isUnauthorized, navigateToLogin]);

  const calendarData = useMemo(() => {
    if (isLoading || isError) {
      return [];
    }

    const calendarData = [];
    for (const [key, value] of Object.entries(data)) {
      calendarData.push({
        id: key,
        title: value.name,
        start: setDateTime(new Date(), value.startTime),
        end: setDateTime(new Date(), value.endTime),
      });
    }

    return calendarData;
  }, [data, isError, isLoading]);

  const onSelect = useCallback(
    event => {
      const existingItem = data[event.id];
      const type = existingItem.type;
      const item = {
        ...existingItem,
        startTime: event.start,
        endTime: event.end,
        date,
      };
      openEditModal(type, item);
    },
    [data, date, openEditModal],
  );

  const scrollToTime = useMemo(() => {
    const hours = new Date().getHours();
    const scrollToTime = new Date(date.getTime());
    scrollToTime.setHours(hours, 0, 0, 0);
    return scrollToTime;
  }, [date]);

  return (
    <div className={styles.hourlySchedule}>
      {isLoading && <MoonLoader />}
      {!isLoading && !isError && (
        <Calendar
          date={date}
          onNavigate={() => {}}
          events={calendarData}
          localizer={calendarLocalizer}
          views={[Views.DAY]}
          defaultView={Views.DAY}
          onSelectEvent={onSelect}
          scrollToTime={scrollToTime}
        />
      )}
    </div>
  );
};
