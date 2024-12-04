import { useCallback, useEffect, useState } from 'react';
import { DaysOfWeekInput } from '../../days-of-week-input';
import { BAD_TIMES_ERROR_TEXT } from './constants.js';
import { TimeInput } from '../../time-input';
import { TextInput } from '../../text-input';

export const SubjectInputs = props => {
  const { setSubject, subject, setError } = props;
  const {
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    startTime = null,
    endTime = null,
    location,
  } = subject;
  const [startTimeIsError, setStartTimeIsError] = useState(false);
  const [startTimeErrorText, setStartTimeErrorText] = useState('');
  const [endTimeIsError, setEndTimeIsError] = useState(false);
  const [endTimeErrorText, setEndTimeErrorText] = useState('');

  useEffect(() => {
    setError(startTimeIsError || endTimeIsError);
  }, [endTimeIsError, setError, startTimeIsError]);

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

  const verifyStartTimeIsBeforeEndTime = useCallback((startTime, endTime) => {
    if (startTime >= endTime) {
      // Todo: Backend is not currently validating this.
      setStartTimeIsError(true);
      setStartTimeErrorText(BAD_TIMES_ERROR_TEXT);
      setEndTimeIsError(true);
      setEndTimeErrorText(BAD_TIMES_ERROR_TEXT);
    } else {
      setStartTimeIsError(false);
      setStartTimeErrorText('');
      setEndTimeIsError(false);
      setEndTimeErrorText('');
    }
  }, []);

  const setStartTime = useCallback(
    startTime => {
      if (!(startTime instanceof Date)) {
        setSubject(previousSubject => {
          return { ...previousSubject, startTime: null };
        });
        setStartTimeIsError(false);
        setStartTimeErrorText('');
      } else {
        setSubject(previousSubject => {
          return { ...previousSubject, startTime };
        });
        if (endTime instanceof Date) {
          verifyStartTimeIsBeforeEndTime(startTime, endTime);
        }
      }
    },
    [endTime, setSubject, verifyStartTimeIsBeforeEndTime],
  );

  const setEndTime = useCallback(
    endTime => {
      if (!(endTime instanceof Date)) {
        setSubject(previousSubject => {
          return { ...previousSubject, endTime: null };
        });
        setStartTimeIsError(false);
        setEndTimeErrorText('');
      } else {
        setSubject(previousSubject => {
          return { ...previousSubject, endTime };
        });
        if (startTime instanceof Date) {
          verifyStartTimeIsBeforeEndTime(startTime, endTime);
        }
      }
    },
    [setSubject, startTime, verifyStartTimeIsBeforeEndTime],
  );

  const setLocation = useCallback(
    location => {
      setSubject(previousSubject => {
        return { ...previousSubject, location };
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
      <TimeInput
        label='Start Time'
        value={startTime}
        onChange={setStartTime}
        isError={startTimeIsError}
        errorText={startTimeErrorText}
      />
      <TimeInput
        label='End Time'
        value={endTime}
        onChange={setEndTime}
        isError={endTimeIsError}
        errorText={endTimeErrorText}
      />
      <TextInput
        label='Location'
        value={location}
        onChange={setLocation}
        maxLength={100}
      />
    </>
  );
};
