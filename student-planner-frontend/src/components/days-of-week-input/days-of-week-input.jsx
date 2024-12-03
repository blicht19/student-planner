import { DayOfWeekButton } from './day-of-week-button.jsx';
import styles from './days-of-week-input.module.css';

export const DaysOfWeekInput = props => {
  const { daysOfWeek, toggleDayOfWeek } = props;

  return (
    <div className={styles.daysOfWeek}>
      <label>Days</label>
      <div className={styles.dayButtons}>
        <DayOfWeekButton
          selected={daysOfWeek.sunday}
          toggleSelected={() => toggleDayOfWeek('sunday')}
          label='S'
        />
        <DayOfWeekButton
          selected={daysOfWeek.monday}
          toggleSelected={() => toggleDayOfWeek('monday')}
          label='M'
        />
        <DayOfWeekButton
          selected={daysOfWeek.tuesday}
          toggleSelected={() => toggleDayOfWeek('tuesday')}
          label='T'
        />
        <DayOfWeekButton
          selected={daysOfWeek.wednesday}
          toggleSelected={() => toggleDayOfWeek('wednesday')}
          label='W'
        />
        <DayOfWeekButton
          selected={daysOfWeek.thursday}
          toggleSelected={() => toggleDayOfWeek('thursday')}
          label='T'
        />
        <DayOfWeekButton
          selected={daysOfWeek.friday}
          toggleSelected={() => toggleDayOfWeek('friday')}
          label='F'
        />
        <DayOfWeekButton
          selected={daysOfWeek.saturday}
          toggleSelected={() => toggleDayOfWeek('saturday')}
          label='S'
        />
      </div>
    </div>
  );
};
