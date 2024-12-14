import dayjs from 'dayjs';
import { dayjsLocalizer } from 'react-big-calendar';

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const compareDateStrings = (a, b) => {
  return Date.parse(a) - Date.parse(b);
};

const parseTimeString = timeString => {
  const [hours, minutesAndPeriod] = timeString.split(':');
  const [minutes, period] = minutesAndPeriod.split(' ');
  let hoursNumber = Number(hours);
  const minutesNumber = Number(minutes);
  if (period === 'AM' && hoursNumber === 12) {
    hoursNumber = 0;
  } else if (period === 'PM' && hoursNumber >= 1 && hoursNumber < 12) {
    hoursNumber += 12;
  }
  return [hoursNumber, minutesNumber];
};

export const setDateTime = (date, timeString) => {
  const [hours, minutes] = parseTimeString(timeString);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

export const calendarLocalizer = dayjsLocalizer(dayjs);
