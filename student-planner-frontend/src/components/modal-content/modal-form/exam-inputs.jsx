import { useCallback, useEffect, useState } from 'react';
import { DateInput } from '../../date-input/index.js';
import {
  BAD_TIMES_ERROR_TEXT,
  END_TIME_REQUIRED_ERROR_TEXT,
  START_TIME_REQUIRED_ERROR_TEXT,
} from './constants.js';
import { TimeInput } from '../../time-input/index.js';
import { SubjectInput } from './subject-input.jsx';
import { TextInput } from '../../text-input/index.js';
import { TextArea } from '../../text-area/index.js';

export const ExamInputs = props => {
  const { setExam, exam, setError } = props;
  const { date, startTime, endTime, subject, location, note } = exam;
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
      setExam(previousExam => {
        return {
          ...previousExam,
          date,
        };
      });
    },
    [setExam],
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
        setStartTimeIsError(true);
        setStartTimeErrorText(START_TIME_REQUIRED_ERROR_TEXT);
      } else if (endTime instanceof Date) {
        verifyStartTimeIsBeforeEndTime(startTime, endTime);
      } else {
        setStartTimeIsError(false);
        setStartTimeErrorText('');
      }
      setExam(previousEvent => {
        return {
          ...previousEvent,
          startTime,
        };
      });
    },
    [endTime, setExam, verifyStartTimeIsBeforeEndTime],
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
      setExam(previousEvent => {
        return {
          ...previousEvent,
          endTime,
        };
      });
    },
    [setExam, startTime, verifyStartTimeIsBeforeEndTime],
  );

  const setLocation = useCallback(
    location => {
      setExam(previousExam => {
        return {
          ...previousExam,
          location,
        };
      });
    },
    [setExam],
  );

  const setSubject = useCallback(
    subject => {
      setExam(previousExam => {
        return {
          ...previousExam,
          subject,
        };
      });
    },
    [setExam],
  );

  const setNote = useCallback(
    note => {
      setExam(previousExam => {
        return {
          ...previousExam,
          note,
        };
      });
    },
    [setExam],
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
