import { Button } from '../../button';
import { useCallback, useMemo, useState } from 'react';
import { NameInput } from './name-input.jsx';
import styles from './modal-form.module.css';
import { modalMenuOptions } from '../modal-menu-options.js';
import { AssignmentInputs } from './assignment-inputs.jsx';
import {
  useCreate,
  useDelete,
  useModalContext,
  useToggle,
  useUpdate,
} from '../../../hooks';
import { TaskInputs } from './task-inputs.jsx';
import { EventInputs } from './event-inputs.jsx';
import { ExamInputs } from './exam-inputs.jsx';
import { SubjectInputs } from './subject-inputs.jsx';

export const ModalForm = () => {
  const { editMode, itemType, closeModal, item } = useModalContext();
  const [nameIsError, setNameIsError] = useState(false);
  const [inputsHaveError, setInputsHaveError] = useState(true);
  const [showDeleteConfirmation, toggleShowDeleteConfirmation] =
    useToggle(false);

  const valid = useMemo(() => {
    return Boolean(item.name) && !nameIsError && !inputsHaveError;
  }, [item.name, nameIsError, inputsHaveError]);

  const createMutation = useCreate(itemType, closeModal);
  const updateMutation = useUpdate(itemType, closeModal);
  const deleteMutation = useDelete(itemType, closeModal);

  const submit = useCallback(() => {
    if (editMode) {
      updateMutation.mutate(item);
    } else {
      createMutation.mutate(item);
    }
  }, [createMutation, editMode, item, updateMutation]);

  return (
    <div className={styles.modalForm}>
      <h2
        className={styles.heading}
      >{`${editMode ? 'Edit' : 'Add'} ${itemType}`}</h2>
      <div className={styles.inputs}>
        <NameInput isError={nameIsError} setIsError={setNameIsError} />
        {(() => {
          switch (itemType) {
            case modalMenuOptions.assignment:
              return <AssignmentInputs setError={setInputsHaveError} />;
            case modalMenuOptions.task:
              return <TaskInputs setError={setInputsHaveError} />;
            case modalMenuOptions.event:
              return <EventInputs setError={setInputsHaveError} />;
            case modalMenuOptions.exam:
              return <ExamInputs setError={setInputsHaveError} />;
            case modalMenuOptions.class:
              return <SubjectInputs setError={setInputsHaveError} />;
            default:
              return null;
          }
        })()}
      </div>
      {!showDeleteConfirmation && (
        <div className={styles.buttons}>
          {editMode && (
            <Button
              text='Delete'
              onClick={toggleShowDeleteConfirmation}
              type='destructive'
            />
          )}
          <Button
            text={editMode ? 'Save' : 'Add'}
            disabled={!valid}
            onClick={submit}
            isLoading={
              editMode ? updateMutation.isLoading : createMutation.isLoading
            }
          />
        </div>
      )}
      {showDeleteConfirmation && (
        <div className={styles.confirmation}>
          <h4 className={styles.confirmationText}>
            Are you sure you want to delete this assignment?
          </h4>
          <div className={styles.buttons}>
            <Button text='Cancel' onClick={toggleShowDeleteConfirmation} />
            <Button
              text='Confirm'
              onClick={() => deleteMutation.mutate(item.id)}
              isLoading={deleteMutation.isLoading}
              type='destructive'
            />
          </div>
        </div>
      )}
    </div>
  );
};
