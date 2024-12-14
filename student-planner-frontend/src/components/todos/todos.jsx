import { Filters } from '../to-do-list/filters.jsx';
import { ToDoList } from '../to-do-list';
import { useMemo, useState } from 'react';
import { useToggle } from '../../hooks/index.js';
import { getDateRangeMap } from '../to-do-list/date-range-map.jsx';

export const Todos = props => {
  const { date } = props;
  const [dateRange, setDateRange] = useState('Next 7 Days');
  const [showCompleted, toggleShowCompleted] = useToggle(false);
  const dateRangeMap = useMemo(() => {
    return getDateRangeMap(date);
  }, [date]);
  const [startDate, endDate] = useMemo(() => {
    return dateRangeMap[dateRange];
  }, [dateRange, dateRangeMap]);

  return (
    <>
      <Filters
        dateRange={dateRange}
        setDateRange={setDateRange}
        showCompleted={showCompleted}
        toggleShowCompleted={toggleShowCompleted}
        dateRangeMap={dateRangeMap}
      />
      <ToDoList
        startDate={startDate}
        endDate={endDate}
        showCompleted={showCompleted}
      />
    </>
  );
};
