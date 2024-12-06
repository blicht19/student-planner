import { Button } from '../../button';
import { useCallback, useMemo, useState } from 'react';
import { NameInput } from './name-input.jsx';
import styles from './modal-form.module.css';
import { modalMenuOptions } from '../modal-menu-options.js';
import { AssignmentInputs } from './assignment-inputs.jsx';
import { useCreate, useModalContext, useUpdate } from '../../../hooks';
import { TaskInputs } from './task-inputs.jsx';
import { EventInputs } from './event-inputs.jsx';
import { ExamInputs } from './exam-inputs.jsx';
import { SubjectInputs } from './subject-inputs.jsx';

export const ModalForm = () => {
  const { editMode, itemType, closeModal, item } = useModalContext();
  const [nameIsError, setNameIsError] = useState(false);
  const [inputsHaveError, setInputsHaveError] = useState(true);
  const valid = useMemo(() => {
    return Boolean(item.name) && !nameIsError && !inputsHaveError;
  }, [item.name, nameIsError, inputsHaveError]);
  const createMutation = useCreate(itemType, closeModal);
  const updateMutation = useUpdate(itemType, closeModal);
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
      <div className={styles.buttons}>
        {editMode && <Button text='Delete' />}
        <Button
          text={editMode ? 'Save' : 'Add'}
          disabled={!valid}
          onClick={submit}
          isLoading={createMutation.isLoading}
        />
      </div>
    </div>
  );
};
