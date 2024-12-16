import { CiEdit } from 'react-icons/ci';
import styles from './to-do-item.module.css';
import { useModalContext, useUpdate } from '../../hooks';
import { useCallback } from 'react';
import { SquareLoader } from 'react-spinners';

/**
 * A single item in the agenda
 * @param {Object} item The agenda item
 * @returns {JSX.Element}
 */
export const ToDoItem = ({ item }) => {
  const { name, complete, dueDate } = item;
  const { openEditModal } = useModalContext();
  const updateMutation = useUpdate(item.type, () => {});

  const onClickEdit = useCallback(() => {
    const subject = item.subject?.id;
    const dueDate = new Date(Date.parse(item.dueDate));
    const itemToEdit = { ...item, subject, dueDate };
    openEditModal(item.type, itemToEdit);
  }, [item, openEditModal]);

  const onClickCheckbox = useCallback(() => {
    const itemBody = {
      ...item,
      dueDate: new Date(Date.parse(item.dueDate)),
      complete: !item.complete,
      subject: item.subject?.id,
    };
    updateMutation.mutate(itemBody);
  }, [item, updateMutation]);

  return (
    <div className={styles.agendaItem}>
      {updateMutation.isPending ? (
        <div className={styles.loadingWrapper}>
          <SquareLoader className={styles.loading} />
        </div>
      ) : (
        <input
          className={styles.agendaItemCheckbox}
          type='checkbox'
          checked={complete}
          onChange={onClickCheckbox}
        />
      )}
      <h4>{name}</h4>
      <h4>{dueDate}</h4>
      <div className={styles.editButtonWrapper}>
        <CiEdit className={styles.editButton} onClick={onClickEdit} />
      </div>
    </div>
  );
};
