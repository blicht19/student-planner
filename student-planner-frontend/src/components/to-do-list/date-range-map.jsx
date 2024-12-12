import { dateFormatter } from '../../utils';

const getTodaysDateString = () => {
  return dateFormatter.format(new Date());
};

const getNextWeekString = () => {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );
  return dateFormatter.format(nextWeek);
};

const getNextMonthString = () => {
  const today = new Date();
  const nextMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 30,
  );
  return dateFormatter.format(nextMonth);
};

const TODAY = new Date();
const TODAY_STRING = dateFormatter.format(TODAY);
const NEXT_WEEK = new Date(
  TODAY.getFullYear(),
  TODAY.getMonth(),
  TODAY.getDate() + 7,
);
const NEXT_WEEK_STRING = dateFormatter.format(NEXT_WEEK);
const NEXT_MONTH = new Date(
  TODAY.getFullYear(),
  TODAY.getMonth(),
  TODAY.getDate() + 30,
);
const NEXT_MONTH_STRING = dateFormatter.format(NEXT_MONTH);
const PAST_START_DATE_STRING = dateFormatter.format(new Date(0));
const FUTURE_END_DATE_STRING = '12/31/9999';

export const getDateRangeMap = () => {
  const today = getTodaysDateString();
  const nextWeek = getNextWeekString();
  const nextMonth = getNextMonthString();
  return {
    Past: [PAST_START_DATE_STRING, today],
    'Next 7 Days': [today, nextWeek],
    'Next Month': [today, nextMonth],
    'All Upcoming': [today, FUTURE_END_DATE_STRING],
  };
};

export const DATE_RANGES = {
  Past: [PAST_START_DATE_STRING, TODAY_STRING],
  'Next 7 Days': [TODAY_STRING, NEXT_WEEK_STRING],
  'Next Month': [TODAY_STRING, NEXT_MONTH_STRING],
  'All Upcoming': [TODAY_STRING, FUTURE_END_DATE_STRING],
};
