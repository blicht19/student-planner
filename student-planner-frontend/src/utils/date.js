import dayjs from 'dayjs';
import { dayjsLocalizer } from 'react-big-calendar';

/**
 * Formatter for dates in the MM/DD/YYYY format
 * @type {Intl.DateTimeFormat}
 */
export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/**
 * Formatter for dates in the HH:MM AM|PM format
 * @type {Intl.DateTimeFormat}
 */
export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

/**
 * Compares to strings representing dates
 * @param {string} a The first date string
 * @param {string} b The second date string
 * @returns {number} > 0 if a is after b, < 0 if a is before b, 0 if the two dates are the same
 */
export const compareDateStrings = (a, b) => {
  return Date.parse(a) - Date.parse(b);
};

/**
 * Gets the hours and minutes from a time string in the HH:MM AM|PM format converted back to the 24-hour format
 * @param {string} timeString A string representing a time
 * @returns {[number,number]} The hours and minutes of this time in the 24-hour format
 */
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

/**
 * Returns a date with the time set to the given time
 * @param {Date} date The initial date
 * @param {string} timeString A string in the HH:MM AM|PM format
 * @returns {Date} date with its time set to the value of timeString
 */
export const setDateTime = (date, timeString) => {
  const existingDate = new Date(date);
  const [hours, minutes] = parseTimeString(timeString);
  existingDate.setHours(hours);
  existingDate.setMinutes(minutes);
  return existingDate;
};

/**
 * Gets the date of the first and last day of the month of the given date
 * @param {Date} date A date
 * @returns {[Date,Date]} The first and last day of the month of date
 */
export const getStartAndEndOfMonth = date => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return [start, end];
};

/**
 * Localizer for the react-big-calendar components
 */
export const calendarLocalizer = dayjsLocalizer(dayjs);

/**
 * Gets all dates on a given day of the week in a month
 * @param {number} day A day of the week, 0 being Sunday, 6 being Saturday
 * @param {Date} dateInMonth A date
 * @returns {Date[]} All dates on a day of the week in a month
 */
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
