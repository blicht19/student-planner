import { useCallback } from 'react';
import { DaysOfWeekInput } from '../../days-of-week-input';

export const SubjectInputs = props => {
  const { setSubject, subject, setError } = props;
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    subject;

  const toggleDayOfWeek = useCallback(
    dayOfWeek => {
      setSubject(previousSubject => {
        const newSubject = { ...previousSubject };
        newSubject[dayOfWeek] = !newSubject[dayOfWeek];
        return newSubject;
      });
    },
    [setSubject],
  );

  return (
    <>
      <DaysOfWeekInput
        daysOfWeek={{
          sunday,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
        }}
        toggleDayOfWeek={toggleDayOfWeek}
      />
    </>
  );
};
