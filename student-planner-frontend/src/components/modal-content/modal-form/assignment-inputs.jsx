import { DateInput } from '../../date-input';
import { Checkbox } from '../../checkbox';
import { useCallback, useEffect, useState } from 'react';
import { TextArea } from '../../text-area';
import { SubjectInput } from './subject-input.jsx';
import { useModalContext } from '../../../hooks';

export const AssignmentInputs = props => {
  const { item, updateItemProperty, setItem } = useModalContext();
  const { setError } = props;
  const { dueDate, complete, subject, note } = item;
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
    setItem(previousItem => {
      return {
        ...previousItem,
        complete: !previousItem.complete,
      };
    });
  }, [setItem]);

  const setSubject = useCallback(
    subject => {
      updateItemProperty('subject', subject);
    },
    [updateItemProperty],
  );

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
      <SubjectInput subject={subject} setSubject={setSubject} />
      <Checkbox
        label='Completed'
        checked={complete}
        toggleChecked={toggleCheckbox}
      />
      <TextArea value={note} label='Notes' onChange={setNote} maxLength={500} />
    </>
  );
};
