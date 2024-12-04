import { useCallback, useEffect, useState } from 'react';
import { DaysOfWeekInput } from '../../days-of-week-input';
import { BAD_TIMES_ERROR_TEXT } from './constants.js';
import { TimeInput } from '../../time-input';
import { TextInput } from '../../text-input';
import { useModalContext } from '../../../hooks';

export const SubjectInputs = props => {
  const { item, updateItemProperty, setItem } = useModalContext();
  const { setError } = props;
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
  } = item;
  const [startTimeIsError, setStartTimeIsError] = useState(false);
  const [startTimeErrorText, setStartTimeErrorText] = useState('');
  const [endTimeIsError, setEndTimeIsError] = useState(false);
  const [endTimeErrorText, setEndTimeErrorText] = useState('');

  useEffect(() => {
    setError(startTimeIsError || endTimeIsError);
  }, [endTimeIsError, setError, startTimeIsError]);

  const toggleDayOfWeek = useCallback(
    dayOfWeek => {
      setItem(previousSubject => {
        const newSubject = { ...previousSubject };
        newSubject[dayOfWeek] = !newSubject[dayOfWeek];
        return newSubject;
      });
    },
    [setItem],
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
        updateItemProperty('startTime', null);
        setStartTimeIsError(false);
        setStartTimeErrorText('');
      } else {
        updateItemProperty('startTime', startTime);
        if (endTime instanceof Date) {
          verifyStartTimeIsBeforeEndTime(startTime, endTime);
        }
      }
    },
    [endTime, updateItemProperty, verifyStartTimeIsBeforeEndTime],
  );

  const setEndTime = useCallback(
    endTime => {
      if (!(endTime instanceof Date)) {
        updateItemProperty('endTime', null);
        setStartTimeIsError(false);
        setEndTimeErrorText('');
      } else {
        updateItemProperty('endTime', endTime);
        if (startTime instanceof Date) {
          verifyStartTimeIsBeforeEndTime(startTime, endTime);
        }
      }
    },
    [updateItemProperty, startTime, verifyStartTimeIsBeforeEndTime],
  );

  const setLocation = useCallback(
    location => {
      updateItemProperty('location', location);
    },
    [updateItemProperty],
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
