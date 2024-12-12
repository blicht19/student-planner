import { FaFilter } from 'react-icons/fa';
import { useToggle } from '../../hooks';
import { getDateRangeMap } from './date-range-map.jsx';
import { Checkbox } from '../checkbox';
import styles from './filters.module.css';
import { useMemo } from 'react';

export const Filters = props => {
  const { dateRange, setDateRange, showCompleted, toggleShowCompleted } = props;
  const [showFilterInputs, toggleShowFilterInputs] = useToggle(false);
  const dateRangeMap = useMemo(() => {
    return getDateRangeMap();
  }, []);

  return (
    <div className={styles.filters}>
      {showFilterInputs && (
        <div className={styles.filtersMenu}>
          {Object.keys(dateRangeMap).map(rangeKey => {
            return (
              <div
                key={rangeKey}
                onClick={() => {
                  setDateRange(rangeKey);
                  toggleShowFilterInputs();
                }}
                className={`${styles.filtersMenuItem} ${dateRange === rangeKey && styles.selected}`}
              >
                {rangeKey}
              </div>
            );
          })}
          <Checkbox
            label='Show Completed'
            checked={showCompleted}
            toggleChecked={toggleShowCompleted}
            className={styles.filtersCheckbox}
          />
        </div>
      )}
      <FaFilter onClick={toggleShowFilterInputs} />
    </div>
  );
};
