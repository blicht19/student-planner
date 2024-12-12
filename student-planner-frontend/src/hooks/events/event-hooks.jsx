import { dateFormatter, handleQueryError, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigateToLogin } from '../navigate';

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

const getEventsInRange = async ({ queryKey }) => {
  const [, range] = queryKey;
  const body = {
    startDate: range.startDate,
    endDate: range.endDate,
  };

  const response = await axios.post(`${BASE_URL}/range`, body);
  return response.data;
};

export const useCreateEvent = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create event');
    },
  });
};

export const useUpdateEvent = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: event => {
      return update(event);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update event');
    },
  });
};

export const useDeleteEvent = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => {
      return deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete event');
    },
  });
};

export const useGetEventsInRange = range => {
  return useQuery({
    queryKey: ['events', range],
    queryFn: getEventsInRange,
  });
};
