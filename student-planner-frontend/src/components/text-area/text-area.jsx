import { useCallback } from 'react';
import styles from './text-area.module.css';

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
