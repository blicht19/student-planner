import { DateInput } from '../../date-input';
import { Checkbox } from '../../checkbox';
import { useCallback } from 'react';
import { TextInput } from '../../text-input/index.js';
import { TextArea } from '../../text-area/index.js';

export const AssignmentInputs = props => {
  const { setAssignment, assignment } = props;
  const { dueDate, complete, subject = '', note = '' } = assignment;
  const setDueDate = useCallback(
    dueDate => {
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
        required
      />
      <TextInput
        label='Subject Placeholder'
        value={subject}
        onChange={setSubject}
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
