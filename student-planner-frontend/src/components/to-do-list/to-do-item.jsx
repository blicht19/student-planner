import { CiEdit } from 'react-icons/ci';
import styles from './to-do-item.module.css';
import { useModalContext } from '../../hooks';
import { useCallback } from 'react';

export const ToDoItem = ({ item }) => {
  const { name, complete, dueDate } = item;
  const { openEditModal } = useModalContext();
  const onClickEdit = useCallback(() => {
    const subject = item.subject?.id;
    const dueDate = new Date(Date.parse(item.dueDate));
    const itemToEdit = { ...item, subject, dueDate };
    openEditModal(item.type, itemToEdit);
  }, [item, openEditModal]);

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
        <CiEdit className={styles.editButton} onClick={onClickEdit} />
      </div>
    </div>
  );
};
