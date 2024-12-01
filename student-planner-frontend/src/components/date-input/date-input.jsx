import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './date-input.module.css';
import { useMemo } from 'react';

export const DateInput = props => {
  const { label, value, onChange, className, required = false } = props;
  const isError = useMemo(() => {
    return required && (value == null || value === '');
  }, [required, value]);
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
