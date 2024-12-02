import { useCallback, useEffect, useState } from 'react';
import { DateInput } from '../../date-input/index.js';
import { Checkbox } from '../../checkbox/index.js';
import { TextArea } from '../../text-area/index.js';

export const TaskInputs = props => {
  const { setTask, task, setError } = props;
  const { dueDate, complete, note } = task;
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
      setTask(previousTask => {
        return {
          ...previousTask,
          dueDate,
        };
      });
    },
    [setTask],
  );

  const toggleCheckbox = useCallback(() => {
    setTask(previousTask => {
      return {
        ...previousTask,
        complete: !previousTask.complete,
      };
    });
  }, [setTask]);

  const setNote = useCallback(
    note => {
      setTask(previousTask => {
        return {
          ...previousTask,
          note,
        };
      });
    },
    [setTask],
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
