import styles from './checkbox.module.css';

export const Checkbox = props => {
  const { checked = false, toggleChecked, label } = props;

  return (
    <div className={styles.checkboxWrapper}>
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
