import styles from './text-input.module.css';
import {
  MdOutlineVisibility as Visible,
  MdOutlineVisibilityOff as Hidden,
} from 'react-icons/md';
import { useToggle } from '../../hooks';

/**
 * A text input field
 * @param {Object} props props
 * @param {string} props.label The label of this text input
 * @param {string} [props.value=''] The value of this text input
 * @param {function} props.onChange Function called to change the value of this text input
 * @param {boolean} [props.isError=false] Indicates whether this text input has an error state
 * @param {string} props.errorText Text displayed if this text input has an error state
 * @param {boolean} [props.isPassword=false] Indicates whether the text in this input should be hidden
 * @param {string} [props.className] An optional CSS class name
 * @param {number} props.maxLength The maximum length of this text input
 * @returns {JSX.Element}
 */
export const TextInput = props => {
  const {
    label,
    value = '',
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
