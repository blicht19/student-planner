import { useCallback, useMemo } from 'react';
import { dateFormatter, setDateTime } from '../../utils';
import { useGetScheduleOnDay, useModalContext } from '../../hooks';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';

const localizer = dayjsLocalizer(dayjs);

export const HourlySchedule = props => {
  const { date } = props;
  const { openEditModal } = useModalContext();
  const day = useMemo(() => {
    return dateFormatter.format(date);
  }, [date]);
  const { isLoading, isError, data, isUnauthorized } = useGetScheduleOnDay(day);
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

  return (
    <div>
      {!isLoading && !isError && (
        <Calendar
          date={date}
          onNavigate={() => {}}
          events={calendarData}
          localizer={localizer}
          views={[Views.DAY]}
          defaultView={Views.DAY}
          onSelectEvent={onSelect}
        />
      )}
    </div>
  );
};
