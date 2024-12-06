import { FaFilter } from 'react-icons/fa';
import { useToggle } from '../../hooks';
import { DATE_RANGES } from './date-range-map.jsx';
import { Checkbox } from '../checkbox';
import styles from './filters.module.css';

export const Filters = props => {
  const { setDateRange, showCompleted, toggleShowCompleted } = props;
  const [showFilterInputs, toggleShowFilterInputs] = useToggle(false);
  return (
    <div className={styles.filters}>
      {showFilterInputs && (
        <div className={styles.filtersMenu}>
          {Object.keys(DATE_RANGES).map(rangeKey => {
            return (
              <div
                key={rangeKey}
                onClick={() => {
                  setDateRange(rangeKey);
                  toggleShowFilterInputs();
                }}
                className={styles.filtersMenuItem}
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
