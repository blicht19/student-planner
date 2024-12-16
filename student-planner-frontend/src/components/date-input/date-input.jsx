import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './date-input.module.css';

/**
 * An input field for a date
 * @param {Object} props props
 * @param {string} props.label The label for this input
 * @param {Date} props.value The value of this date input
 * @param {function} props.onChange Function called to change the value of this date input
 * @param {string} [props.className] An optional CSS class name
 * @param {boolean} [props.isError=false] Indicates whether this input has an error state
 * @returns {JSX.Element}
 */
export const DateInput = props => {
  const { label, value, onChange, className, isError = false } = props;
  return (
    <div
      className={`${styles.dateInput} ${isError && styles.inputError} ${className}`}
    >
      <label className={styles.dateInputLabel}>{label}</label>
      <DatePicker selected={value} onChange={onChange} />
      {isError && (
        <div className={styles.errorLabel}>{`${label} is required`}</div>
      )}
    </div>
  );
};
