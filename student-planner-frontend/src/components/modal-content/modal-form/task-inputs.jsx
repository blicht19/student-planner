import { useCallback, useEffect, useState } from 'react';
import { DateInput } from '../../date-input';
import { Checkbox } from '../../checkbox';
import { TextArea } from '../../text-area';
import { useModalContext } from '../../../hooks';

/**
 * Input fields for a task
 * @param {Object} props
 * @param {function} props.setError Function for setting the error state of the inputs
 * @returns {JSX.Element}
 */
export const TaskInputs = props => {
  const { item, updateItemProperty, setItem } = useModalContext();
  const { setError } = props;
  const { dueDate, complete, note } = item;
  const [dueDateIsError, setDueDateIsError] = useState(false);

  useEffect(() => {
    setError(!(dueDate instanceof Date));
  }, [dueDate, setError]);

  const setDueDate = useCallback(
    dueDate => {
      if (!(dueDate instanceof Date)) {
        setDueDateIsError(true);
      } else {
        setDueDateIsError(false);
      }
      updateItemProperty('dueDate', dueDate);
    },
    [updateItemProperty],
  );

  const toggleCheckbox = useCallback(() => {
    setItem(previousTask => {
      return {
        ...previousTask,
        complete: !previousTask.complete,
      };
    });
  }, [setItem]);

  const setNote = useCallback(
    note => {
      updateItemProperty('note', note);
    },
    [updateItemProperty],
  );

  return (
    <>
      <DateInput
        label='Due Date'
        value={dueDate}
        onChange={setDueDate}
        isError={dueDateIsError}
      />
      <Checkbox
        label='Completed'
        checked={complete}
        toggleChecked={toggleCheckbox}
      />
      <TextArea value={note} label='Notes' onChange={setNote} maxLength={500} />
    </>
  );
};
