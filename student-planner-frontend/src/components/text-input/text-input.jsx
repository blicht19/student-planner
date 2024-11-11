import styles from './text-input.module.css';
import {
  MdOutlineVisibility as Visible,
  MdOutlineVisibilityOff as Hidden,
} from 'react-icons/md';
import { useToggle } from '../../hooks';

export const TextInput = props => {
  const {
    label,
    value,
    onChange,
    isError = false,
    errorText,
    isPassword = false,
    className,
    maxLength,
  } = props;
  const [visible, toggleVisibility] = useToggle(false);

  return (
    <div className={`${styles.textInput} ${className}`}>
      <label className={styles.textInputLabel}>{label}</label>
      <div className={`${styles.inputWrapper} ${isError && styles.inputError}`}>
        <input
          type={!isPassword || visible ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={styles.input}
          maxLength={maxLength}
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
