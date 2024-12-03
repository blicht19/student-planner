import styles from './day-of-week-button.module.css';

export const DayOfWeekButton = props => {
  const { selected = false, toggleSelected, label } = props;

  return (
    <button
      className={`${styles.dayOfWeekButton} ${selected ? styles.active : ''}`}
      onClick={toggleSelected}
    >
      {label}
    </button>
  );
};
