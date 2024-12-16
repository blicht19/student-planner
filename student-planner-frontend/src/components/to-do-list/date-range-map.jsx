import { dateFormatter } from '../../utils';

/**
 * Returns a string representing the date one week after the given date
 * @param {Date} today The current date
 * @returns {string} A string representing the date one week after the given date
 */
const getNextWeekString = today => {
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );
  return dateFormatter.format(nextWeek);
};

/**
 * Returns a string representing the date one month (30 days) after the given date
 * @param {Date} today The current date
 * @returns {string} A string representing the date one month (30 days) after the given date
 */
const getNextMonthString = today => {
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30,
  );
  return dateFormatter.format(nextMonth);
};

/**
 * Returns a string representing the date one day before the given date
 * @param {Date} today The current date
 * @returns {string} A string representing the date on day before the given date
 */
const getYesterdayString = today => {
  const yesterday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  return dateFormatter.format(yesterday);
};

const PAST_START_DATE_STRING = dateFormatter.format(new Date(0));
const FUTURE_END_DATE_STRING = '12/31/9999';

/**
 * Returns a map of the labels to the start and end values for the filter on the agenda component
 * @param {Date} date The current date
 * @returns {{'Next 7 Days': (string)[], Past: (string)[], 'All Upcoming': (string)[], 'Next Month': (string)[]}} A map of the labels to the start and end values for the filter on the agenda component
 */
export const getDateRangeMap = date => {
  const today = dateFormatter.format(date);
  const yesterday = getYesterdayString(date);
  const nextWeek = getNextWeekString(date);
  const nextMonth = getNextMonthString(date);

  return {
    Past: [PAST_START_DATE_STRING, yesterday],
    'Next 7 Days': [today, nextWeek],
    'Next Month': [today, nextMonth],
    'All Upcoming': [today, FUTURE_END_DATE_STRING],
  };
};
