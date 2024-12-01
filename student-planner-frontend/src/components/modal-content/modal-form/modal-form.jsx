import { Button } from '../../button';
import { useState } from 'react';
import { NameInput } from './name-input.jsx';
import styles from './modal-form.module.css';
import { modalMenuOptions } from '../modal-menu-options.js';
import { AssignmentInputs } from './assignment-inputs.jsx';

export const ModalForm = props => {
  const { edit = false, itemType } = props;
  const [name, setName] = useState('');
  const [nameIsError, setNameIsError] = useState(false);
  const [item, setItem] = useState({});

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
                <AssignmentInputs assignment={item} setAssignment={setItem} />
              );
            default:
              return null;
          }
        })()}
      </div>
      <div className={styles.buttons}>
        {edit && <Button text='Delete' />}
        <Button text={edit ? 'Save' : 'Add'} />
      </div>
    </div>
  );
};
