import { dateFormatter, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = '/backend/events';

const assembleEventBody = event => {
  return {
    name: event.name,
    date: dateFormatter.format(event.date),
    startTime: timeFormatter.format(event.startTime),
    endTime: timeFormatter.format(event.endTime),
    location: event.location,
    note: event.note,
    id: event.id,
  };
};

const create = async event => {
  const body = assembleEventBody(event);

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

const update = async event => {
  const body = assembleEventBody(event);

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

const deleteEvent = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
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

export const useUpdateEvent = success => {
  return useMutation({
    mutationFn: event => {
      return update(event);
    },
    onSuccess: () => {
      success();
    },
  });
};

export const useDeleteEvent = success => {
  return useMutation({
    mutationFn: id => {
      return deleteEvent(id);
    },
    onSuccess: () => {
      success();
    },
  });
};
