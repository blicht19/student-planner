import styles from './checkbox.module.css';

/**
 * A checkbox component
 * @param {Object} props
 * @param {boolean} [props.checked=false] The state of this checkbox
 * @param {function} props.toggleChecked The function for toggling the checked state of this component
 * @param {string} props.label The label for this checkbox
 * @param {string} [props.className] An optional CSS class name
 * @returns {JSX.Element}
 */
export const Checkbox = props => {
  const { checked = false, toggleChecked, label, className } = props;

  return (
    <div className={`${styles.checkboxWrapper} ${className}`}>
      <label>{label}</label>
      <input
        className={styles.checkbox}
        type='checkbox'
        checked={checked}
        onChange={toggleChecked}
      />
    </div>
  );
};
