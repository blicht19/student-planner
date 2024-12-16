import { useCallback } from 'react';
import styles from './dropdown.module.css';

/**
 * A dropdown menu component
 * @param {Object} props props
 * @param {string} props.label The label for this menu
 * @param {Object[]} props.options An array of objects containing the label and value of options in this menu
 * @param {any} props.selectedItem The selected value of this menu
 * @param {function} props.onChange The function called to change the value of this menu
 * @returns {JSX.Element}
 * @constructor
 */
export const Dropdown = props => {
  const { label, options = [], selectedItem, onChange } = props;
  const handleChange = useCallback(
    event => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className={styles.dropdown}>
      <label>{label}</label>
      <select
        onChange={handleChange}
        value={selectedItem}
        className={styles.dropdownSelect}
      >
        <option value={null}></option>
        {options.map(option => {
          return (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
