import styles from './checkbox.module.css';

export const Checkbox = props => {
  const { checked = false, toggleChecked, label, className } = props;

  return (
    <div className={`${styles.checkboxWrapper} ${className}`}>
      <label>{label}</label>
      <input
        className={styles.checkbox}
        type='checkbox'
        checked={checked}
        onChange={toggleChecked}
      />
    </div>
  );
};
