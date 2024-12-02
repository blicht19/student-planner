import { useCallback, useEffect, useState } from 'react';
import { TimeInput } from '../../time-input';
import { DateInput } from '../../date-input';
import { TextInput } from '../../text-input';
import { TextArea } from '../../text-area';

const BAD_TIMES_ERROR_TEXT = 'Start time must be before end time';
const START_TIME_REQUIRED_ERROR_TEXT = 'Start time is required';
const END_TIME_REQUIRED_ERROR_TEXT = 'End time is required';

export const EventInputs = props => {
  const { setEvent, event, setError } = props;
  const { date, startTime, endTime, location, note } = event;
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
      setEvent(previousEvent => {
        return {
          ...previousEvent,
          date,
        };
      });
    },
    [setEvent],
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
      setEvent(previousEvent => {
        return {
          ...previousEvent,
          startTime,
        };
      });
    },
    [endTime, setEvent, verifyStartTimeIsBeforeEndTime],
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
      setEvent(previousEvent => {
        return {
          ...previousEvent,
          endTime,
        };
      });
    },
    [setEvent, startTime, verifyStartTimeIsBeforeEndTime],
  );

  const setLocation = useCallback(
    location => {
      setEvent(previousEvent => {
        return {
          ...previousEvent,
          location,
        };
      });
    },
    [setEvent],
  );

  const setNote = useCallback(
    note => {
      setEvent(previousEvent => {
        return {
          ...previousEvent,
          note,
        };
      });
    },
    [setEvent],
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
