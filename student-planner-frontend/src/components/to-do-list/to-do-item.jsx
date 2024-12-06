import { CiEdit } from 'react-icons/ci';
import styles from './to-do-item.module.css';

export const ToDoItem = props => {
  const { name, complete, dueDate, note, subject, id, type } = props;
  return (
    <div className={styles.agendaItem}>
      <input
        className={styles.agendaItemCheckbox}
        type='checkbox'
        checked={complete}
      />
      <h4>{name}</h4>
      <h4>{dueDate}</h4>
      <div className={styles.editButtonWrapper}>
        <CiEdit className={styles.editButton} />
      </div>
    </div>
  );
};
