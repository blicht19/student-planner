import { dateFormatter, handleQueryError } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/tasks';

/**
 * Assembles a request body for creating or updating a task from an Object that contains the values of the inputs from the modal
 * @param {Object} task The values of the inputs from the task creation/editing modal
 * @returns {{note: string?, dueDate: string, name: string, id: number?, complete: boolean}}
 */
const assembleTaskBody = task => {
  return {
    name: task.name,
    complete: Boolean(task.complete),
    note: task.note,
    dueDate: dateFormatter.format(task.dueDate),
    id: task.id,
  };
};

/**
 * Function for creating a task
 * @param {Object} task Object containing the values of the inputs of the task creation modal
 * @returns {Promise<any>} The response from the backend when attempting to create a task
 */
const create = async task => {
  const body = assembleTaskBody(task);

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

/**
 * Function for updating a task
 * @param {Object} task Object containing the values of the inputs of the task editing modal
 * @returns {Promise<any>} The response from the backend when attempting to update a task
 */
const update = async task => {
  const body = assembleTaskBody(task);

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

/**
 * Function for deleting a task
 * @param {number} id The ID number of a task
 * @returns {Promise<any>} The response from the backend when attempting to delete the task
 */
const deleteTask = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
  return response.data;
};

/**
 * Function for retrieving tasks filtered by a range of due dates and completion status
 * @param {any[]} queryKey The query key from the useMutation hook, which should include the object representing the filter
 * @returns {Promise<any>} The tasks returned from the backend
 */
const getFiltered = async ({ queryKey }) => {
  const body = getFilterFromQueryKey(queryKey);

  const response = await axios.post(`${BASE_URL}/filter`, body);
  return response.data;
};

/**
 * Hook for creating a task
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useCreateTask = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: task => {
      return create(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create task');
    },
  });
};

/**
 * Hook for updating a task
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useUpdateTask = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: task => {
      return update(task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update task');
    },
  });
};

/**
 * Hook for deleting a task
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useDeleteTask = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => {
      return deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete task');
    },
  });
};

/**
 * Hook for getting tasks filtered by due date range and completion status
 * @param {Object} filter The filter
 * @param {string} filter.startDate The start of the range of due dates
 * @param {string} filter.endDate The end of the range of due dates
 * @param {boolean} filter.showCompleted Indicates whether completed tasks should be returned
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetTasksFiltered = filter => {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: getFiltered,
  });
};
