import { DateInput } from '../../date-input';
import { Checkbox } from '../../checkbox';
import { useCallback, useEffect, useState } from 'react';
import { TextArea } from '../../text-area';
import { SubjectInput } from './subject-input.jsx';

export const AssignmentInputs = props => {
  const { setAssignment, assignment, setError } = props;
  const { dueDate, complete, subject, note } = assignment;
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
      setAssignment(previousAssignment => {
        return {
          ...previousAssignment,
          dueDate,
        };
      });
    },
    [setAssignment],
  );
  const toggleCheckbox = useCallback(() => {
    setAssignment(previousAssignment => {
      return {
        ...previousAssignment,
        complete: !previousAssignment.complete,
      };
    });
  }, [setAssignment]);

  const setSubject = useCallback(
    subject => {
      setAssignment(previousAssignment => {
        return {
          ...previousAssignment,
          subject,
        };
      });
    },
    [setAssignment],
  );

  const setNote = useCallback(
    note => {
      setAssignment(previousAssignment => {
        return {
          ...previousAssignment,
          note,
        };
      });
    },
    [setAssignment],
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
