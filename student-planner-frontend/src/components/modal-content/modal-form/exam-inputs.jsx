import { useCallback, useEffect, useState } from 'react';
import { DateInput } from '../../date-input';
import {
  BAD_TIMES_ERROR_TEXT,
  END_TIME_REQUIRED_ERROR_TEXT,
  START_TIME_REQUIRED_ERROR_TEXT,
} from './constants.js';
import { TimeInput } from '../../time-input';
import { SubjectInput } from './subject-input.jsx';
import { TextInput } from '../../text-input';
import { TextArea } from '../../text-area';
import { useModalContext } from '../../../hooks';

export const ExamInputs = props => {
  const { item, updateItemProperty } = useModalContext();
  const { setError } = props;
  const { date, startTime, endTime, subject, location, note } = item;
  const [dateIsError, setDateIsError] = useState(false);
  const [startTimeIsError, setStartTimeIsError] = useState(false);
  const [startTimeErrorText, setStartTimeErrorText] = useState('');
  const [endTimeIsError, setEndTimeIsError] = useState(false);
  const [endTimeErrorText, setEndTimeErrorText] = useState('');

  useEffect(() => {
    setError(
      !(date instanceof Date) ||
        startTimeIsError ||
        endTimeIsError ||
        !(startTime instanceof Date) ||
        !(endTime instanceof Date),
    );
  }, [date, endTime, endTimeIsError, setError, startTime, startTimeIsError]);

  const setDate = useCallback(
    date => {
      if (!(date instanceof Date)) {
        setDateIsError(true);
      } else {
        setDateIsError(false);
      }
      updateItemProperty('date', date);
    },
    [updateItemProperty],
  );

  const verifyStartTimeIsBeforeEndTime = useCallback((startTime, endTime) => {
    if (startTime >= endTime) {
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
        setStartTimeIsError(true);
        setStartTimeErrorText(START_TIME_REQUIRED_ERROR_TEXT);
      } else if (endTime instanceof Date) {
        verifyStartTimeIsBeforeEndTime(startTime, endTime);
      } else {
        setStartTimeIsError(false);
        setStartTimeErrorText('');
      }
      updateItemProperty('startTime', startTime);
    },
    [endTime, updateItemProperty, verifyStartTimeIsBeforeEndTime],
  );

  const setEndTime = useCallback(
    endTime => {
      if (!(endTime instanceof Date)) {
        setEndTimeIsError(true);
        setEndTimeErrorText(END_TIME_REQUIRED_ERROR_TEXT);
      } else if (startTime instanceof Date) {
        verifyStartTimeIsBeforeEndTime(startTime, endTime);
      } else {
        setEndTimeIsError(false);
        setEndTimeErrorText('');
      }
      updateItemProperty('endTime', endTime);
    },
    [updateItemProperty, startTime, verifyStartTimeIsBeforeEndTime],
  );

  const setLocation = useCallback(
    location => {
      updateItemProperty('location', location);
    },
    [updateItemProperty],
  );

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
        label='Date'
        value={date}
        onChange={setDate}
        isError={dateIsError}
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
      <SubjectInput subject={subject} setSubject={setSubject} />
      <TextInput
        label='Location'
        value={location}
        onChange={setLocation}
        maxLength={100}
      />
      <TextArea value={note} label='Notes' onChange={setNote} maxLength={500} />
    </>
  );
};
