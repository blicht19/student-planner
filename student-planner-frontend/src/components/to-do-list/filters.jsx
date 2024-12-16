import { FaFilter } from 'react-icons/fa';
import { useToggle } from '../../hooks';
import { Checkbox } from '../checkbox';
import styles from './filters.module.css';

/**
 * The filter button on the agenda. Allows the user to select what range of agenda items to display and whether to display completed items.
 * @param {Object} props props
 * @param {string} props.dateRange The currently selected range of agenda items to show
 * @param {function} props.setDateRange Function for setting the selected date range
 * @param {boolean} props.showCompleted The value of the checkbox that toggles whether to show completed items
 * @param {function} props.toggleShowCompleted Function that toggles the state of the checkbox
 * @param {Object} props.dateRangeMap Object with the labels for date ranges as keys and the start and end of those ranges as values
 * @returns {JSX.Element}
 * @constructor
 */
export const Filters = props => {
  const {
    dateRange,
    setDateRange,
    showCompleted,
    toggleShowCompleted,
    dateRangeMap,
  } = props;
  const [showFilterInputs, toggleShowFilterInputs] = useToggle(false);

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
