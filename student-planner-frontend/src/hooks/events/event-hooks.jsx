import { dateFormatter, handleQueryError, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/events';

/**
 * Creates an event request body from an Object that stores the inputs from the event creation/editing modal
 * @param {Object} event The Object that stores the inputs from the event creation/editing modal
 * @returns {{date: string, note: *, name, startTime: string, location, endTime: string, id}} The request body for creating or updating an event
 */
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

/**
 * Function for creating an event
 * @param {Object} event The Object that stores the inputs from the event creation modal
 * @returns {Promise<any>} The response from the backend when attempting to create an event
 */
const create = async event => {
  const body = assembleEventBody(event);

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

/**
 * Function for updating an event
 * @param {Object} event The Object that stores the inputs from the event editing modal
 * @returns {Promise<any>} The response from the backend when attempting to update an event
 */
const update = async event => {
  const body = assembleEventBody(event);

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

/**
 * Function for deleting an event
 * @param {number} id The ID number of an event
 * @returns {Promise<any>} The response from the backend when attempting to delete an event
 */
const deleteEvent = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
  return response.data;
};

/**
 * Function for getting events in a range of dates
 * @param {any[]} queryKey The query key from the hook that should include an object with the start and end of the range of events
 * @returns {Promise<any>} The events returned from the backend
 */
const getEventsInRange = async ({ queryKey }) => {
  const [, range] = queryKey;
  const body = {
    startDate: range.startDate,
    endDate: range.endDate,
  };

  const response = await axios.post(`${BASE_URL}/range`, body);
  return response.data;
};

/**
 * Hook for creating an event
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
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

/**
 * Hook for updating an event
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
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

/**
 * Hook for deleting an event
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
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

/**
 * Hook for getting the events in a range of dates
 * @param {Object} range The range of dates of events to return
 * @param {string} range.startDate The start of the range of dates of events to return
 * @param {string} range.endDate The end of the range of dates of events to return
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetEventsInRange = range => {
  return useQuery({
    queryKey: ['events', range],
    queryFn: getEventsInRange,
  });
};
