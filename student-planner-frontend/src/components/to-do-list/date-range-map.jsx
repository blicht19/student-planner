import { dateFormatter } from '../../utils';

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
const PAST_START_DATE = new Date(0);
const PAST_START_DATE_STRING = dateFormatter.format(PAST_START_DATE);
const FUTERE_END_DATE_STRING = '12/31/9999';

export const DATE_RANGES = {
  Past: [PAST_START_DATE_STRING, TODAY_STRING],
  'Next 7 Days': [TODAY_STRING, NEXT_WEEK_STRING],
  'Next Month': [TODAY_STRING, NEXT_MONTH_STRING],
  'All Upcoming': [TODAY_STRING, FUTERE_END_DATE_STRING],
};
