import DatePicker from 'react-datepicker';
import styles from './time-input.module.css';

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
