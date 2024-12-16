import { useCallback } from 'react';
import styles from './text-area.module.css';

/**
 * Input for inputting or editing a large section of text
 * @param {Object} props props
 * @param {string} props.label The label for this text area
 * @param {string} [props.value=''] The value of this text area
 * @param {function} props.onChange Function called to change the value of this text area
 * @param {string} [props.className] Optional CSS class name
 * @param {number} props.maxLength The maximum length of the value of this text area
 * @returns {JSX.Element}
 * @constructor
 */
export const TextArea = props => {
  const { label, value = '', onChange, className, maxLength } = props;
  const handleChange = useCallback(
    event => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className={`${styles.textArea} ${className}`}>
      <label>{label}</label>
      <textarea
        className={styles.textAreaInput}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
      />
    </div>
  );
};
