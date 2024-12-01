import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './date-input.module.css';

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
