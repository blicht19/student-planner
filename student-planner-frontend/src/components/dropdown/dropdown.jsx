import { useCallback } from 'react';
import styles from './dropdown.module.css';

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
