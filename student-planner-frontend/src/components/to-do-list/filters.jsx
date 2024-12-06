import { FaFilter } from 'react-icons/fa';
import { useToggle } from '../../hooks';
import { DATE_RANGES } from './date-range-map.jsx';
import { Checkbox } from '../checkbox';

export const Filters = props => {
  const { setDateRange, showCompleted, toggleShowCompleted } = props;
  const [showFilterInputs, toggleShowFilterInputs] = useToggle(false);
  return (
    <div>
      <FaFilter onClick={toggleShowFilterInputs} />
      {showFilterInputs && (
        <div>
          {Object.keys(DATE_RANGES).map(rangeKey => {
            return (
              <div
                key={rangeKey}
                onClick={() => {
                  setDateRange(rangeKey);
                  toggleShowFilterInputs();
                }}
              >
                {rangeKey}
              </div>
            );
          })}
          <Checkbox
            label='Show Completed'
            checked={showCompleted}
            toggleChecked={toggleShowCompleted}
          />
        </div>
      )}
    </div>
  );
};
