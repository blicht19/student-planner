import styles from './text-input.module.css';
import {
  MdOutlineVisibility as Visible,
  MdOutlineVisibilityOff as Hidden,
} from 'react-icons/md';
import { useCallback, useState } from 'react';

export const TextInput = props => {
  const {
    label,
    value,
    onChange,
    isError = false,
    errorText,
    isPassword = false,
    className,
  } = props;
  const [visible, setVisible] = useState(false);
  const toggleVisibility = useCallback(() => {
    setVisible(previous => !previous);
  }, [setVisible]);

  return (
    <div className={`${styles.textInput} ${className}`}>
      <label className={styles.textInputLabel}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type={!isPassword || visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`${styles.input} ${isError && styles.inputError}`}
        />
        <div
          className={`${styles.iconWrapper} ${!isPassword && styles.hidden}`}
          onClick={toggleVisibility}
        >
          {visible ? <Hidden /> : <Visible />}
        </div>
      </div>
      {isError && errorText && (
        <div className={styles.errorLabel}>{errorText}</div>
      )}
    </div>
  );
};
