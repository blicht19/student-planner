import styles from './text-input.module.css';

export const TextInput = props => {
  const {
    label,
    value,
    onChange,
    isError = false,
    errorText,
    isPassword = false,
  } = props;

  return (
    <div className={styles.textInput}>
      <label className={styles.textInputLabel}>{label}</label>
      <input
        type={isPassword ? 'password' : 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`${styles.input} ${isError && styles.inputError}`}
      />
      {isError && errorText && (
        <div className={styles.errorLabel}>{errorText}</div>
      )}
    </div>
  );
};
