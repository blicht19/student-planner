import { dateFormatter, handleQueryError } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/assignments';

/**
 * Function for creating an assignment
 * @param {Object} assignment Object with data from the assignment creation form
 * @returns {Promise<any>} Response from the backend when attempting to create this assignment
 */
const create = async assignment => {
  const body = {
    name: assignment.name,
    complete: Boolean(assignment.complete),
    subjectId: assignment.subject,
    note: assignment.note,
    dueDate: dateFormatter.format(assignment.dueDate),
    id: assignment.id,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

/**
 * Function for updating an existing assignment
 * @param {Object} assignment Object with data from the assignment editing form
 * @returns {Promise<any>} Response from the backend when attempting to update this assignment
 */
const update = async assignment => {
  const body = {
    name: assignment.name,
    complete: Boolean(assignment.complete),
    subjectId: assignment.subject !== '' ? assignment.subject : 0,
    note: assignment.note,
    dueDate: dateFormatter.format(assignment.dueDate),
    id: assignment.id,
  };

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

/**
 * Function for deleting an assignment
 * @param {number} id The id number of the assignment
 * @returns {Promise<any>} The response from the backend when attempting to delete this assignment
 */
const deleteAssignment = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
  return response.data;
};

/**
 * Function for retrieving assignment filtered by a range of due dates and completion status
 * @param {any[]} queryKey The query key from the useMutation hook, which should include the object representing the filter
 * @returns {Promise<any>} The assignments returned from the backend
 */
const getFiltered = async ({ queryKey }) => {
  const body = getFilterFromQueryKey(queryKey);

  const response = await axios.post(`${BASE_URL}/filter`, body);
  return response.data;
};

/**
 * Hook for creating an assignment
 * @param {function} success Function to be called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useCreateAssignment = success => {
  const queryClient = useQueryClient();
  const navigateToLogin = useNavigateToLogin();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create assignment');
    },
  });
};

/**
 * Hook for updating an assignment
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useUpdateAssignment = success => {
  const queryClient = useQueryClient();
  const navigateToLogin = useNavigateToLogin();
  return useMutation({
    mutationFn: assignment => {
      return update(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update assignment');
    },
  });
};

/**
 * Hook for deleting an assignment
 * @param {function} success Function called if the delete request is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useDeleteAssignment = success => {
  const queryClient = useQueryClient();
  const navigateToLogin = useNavigateToLogin();
  return useMutation({
    mutationFn: id => {
      return deleteAssignment(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete assignment');
    },
  });
};

/**
 * Hook for getting assignment filtered by due date range and completion status
 * @param {Object} filter The filter
 * @param {string} filter.startDate The start of the range of due dates
 * @param {string} filter.endDate The end of the range of due dates
 * @param {boolean} filter.showCompleted Indicates whether completed assignment should be returned
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetAssignmentsFiltered = filter => {
  return useQuery({
    queryKey: ['assignments', filter],
    queryFn: getFiltered,
  });
};
