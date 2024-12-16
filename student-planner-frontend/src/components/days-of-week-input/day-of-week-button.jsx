import styles from './day-of-week-button.module.css';

/**
 * Toggleable button for a day of the week
 * @param {Object} props props
 * @param {boolean} [props.selected=false] The state of this button
 * @param {function} props.toggleSelected Function for toggling the state of this button
 * @param {string} props.label The label for this button
 * @returns {JSX.Element}
 */
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
