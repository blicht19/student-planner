import { dateFormatter, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = '/backend/events';

const create = async event => {
  const body = {
    name: event.name,
    date: dateFormatter.format(event.date),
    startTime: timeFormatter.format(event.startTime),
    endTime: timeFormatter.format(event.endTime),
    location: event.location,
    note: event.note,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

export const useCreateEvent = success => {
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      success();
    },
  });
};
