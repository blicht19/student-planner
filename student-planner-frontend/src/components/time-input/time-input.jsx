import DatePicker from 'react-datepicker';
import styles from './time-input.module.css';

/**
 * A time input field
 * @param {Object} props props
 * @param {string} props.label The label for this time input
 * @param {Date} props.value The value of this time input
 * @param {function} props.onChange Function called to change the value of this time input
 * @param {string} [props.className] An optional CSS class name
 * @param {boolean} [props.isError=false] Indicates whether this time input has an error state
 * @param {string} props.errorText Text displayed if this time input has an error state
 * @returns {JSX.Element}
 */
export const TimeInput = props => {
  const {
    label,
    value,
    onChange,
    className,
    isError = false,
    errorText,
  } = props;
  return (
    <div
      className={`${styles.timeInput} ${isError && styles.inputError} $ ${className}`}
    >
      <label className={styles.timeInputLabel}>{label}</label>
      <DatePicker
        selected={value}
        onChange={onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        showTimeCaption={false}
        dateFormat={'hh:mm aa'}
      />
      {isError && <div className={styles.errorLabel}>{errorText}</div>}
    </div>
  );
};
