import { Button } from '../../button';
import { useCallback, useMemo, useState } from 'react';
import { NameInput } from './name-input.jsx';
import styles from './modal-form.module.css';
import { modalMenuOptions } from '../modal-menu-options.js';
import { AssignmentInputs } from './assignment-inputs.jsx';
import { useCreate } from '../../../hooks';
import { TaskInputs } from './task-inputs.jsx';
import { EventInputs } from './event-inputs.jsx';
import { ExamInputs } from './exam-inputs.jsx';

export const ModalForm = props => {
  const { edit = false, itemType, onClose } = props;
  const [name, setName] = useState('');
  const [nameIsError, setNameIsError] = useState(false);
  const [item, setItem] = useState({});
  const [inputsHaveError, setInputsHaveError] = useState(true);
  const valid = useMemo(() => {
    return name && !nameIsError && !inputsHaveError;
  }, [name, nameIsError, inputsHaveError]);
  const createMutation = useCreate(itemType, onClose);
  const submit = useCallback(() => {
    if (edit) {
      // Todo: Add editing hook
    } else {
      createMutation.mutate({ ...item, name });
    }
  }, [createMutation, edit, item, name]);

  return (
    <div className={styles.modalForm}>
      <h2
        className={styles.heading}
      >{`${edit ? 'Edit' : 'Add'} ${itemType}`}</h2>
      <div className={styles.inputs}>
        <NameInput
          name={name}
          setName={setName}
          isError={nameIsError}
          setIsError={setNameIsError}
        />
        {(() => {
          switch (itemType) {
            case modalMenuOptions.assignment:
              return (
                <AssignmentInputs
                  assignment={item}
                  setAssignment={setItem}
                  setError={setInputsHaveError}
                />
              );
            case modalMenuOptions.task:
              return (
                <TaskInputs
                  task={item}
                  setTask={setItem}
                  setError={setInputsHaveError}
                />
              );
            case modalMenuOptions.event:
              return (
                <EventInputs
                  event={item}
                  setEvent={setItem}
                  setError={setInputsHaveError}
                />
              );
            case modalMenuOptions.exam:
              return (
                <ExamInputs
                  exam={item}
                  setExam={setItem}
                  setError={setInputsHaveError}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
      <div className={styles.buttons}>
        {edit && <Button text='Delete' />}
        <Button
          text={edit ? 'Save' : 'Add'}
          disabled={!valid}
          onClick={submit}
          isLoading={createMutation.isLoading}
        />
      </div>
    </div>
  );
};
