import { dateFormatter } from '../../utils';

const getNextWeekString = today => {
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );
  return dateFormatter.format(nextWeek);
};

const getNextMonthString = today => {
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30,
  );
  return dateFormatter.format(nextMonth);
};

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
