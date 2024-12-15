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
  const existingDate = new Date(date);
  const [hours, minutes] = parseTimeString(timeString);
  existingDate.setHours(hours);
  existingDate.setMinutes(minutes);
  return existingDate;
};

export const getStartAndEndOfMonth = date => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return [start, end];
};

export const calendarLocalizer = dayjsLocalizer(dayjs);

export const getAllDaysOnDayOfWeekInMonth = (day, dateInMonth) => {
  const [, end] = getStartAndEndOfMonth(dateInMonth);
  const days = [];
  let firstMatchIndex;
  for (let i = 1; i <= end.getDate(); i++) {
    const date = new Date(dateInMonth.getFullYear(), dateInMonth.getMonth(), i);
    if (date.getDay() === day) {
      days.push(date);
      firstMatchIndex = i;
      break;
    }
  }

  for (let i = firstMatchIndex + 7; i <= end.getDate(); i += 7) {
    const date = new Date(dateInMonth.getFullYear(), dateInMonth.getMonth(), i);
    days.push(date);
  }

  return days;
};
