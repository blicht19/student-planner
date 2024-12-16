import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { handleQueryError, timeFormatter } from '../../utils';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/subjects';

/**
 * Function for retrieving all subjects
 * @returns {Promise<any>} The subjects returned from the backend
 */
const getSubjects = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Function for retrieving all subjects on a specific day of the week
 * @param {any[]} queryKey The query key from the hook that should include the day of the week
 * @returns {Promise<any>}
 */
const getSubjectsOnDay = async ({ queryKey }) => {
  const [, day] = queryKey;
  const dayOfWeek = new Date(Date.parse(day)).getDay();
  const url = `${BASE_URL}/day?day=${dayOfWeek}`;
  const response = await axios.get(url);
  return response.data;
};

/**
 * Function for creating a subject
 * @param {Object} subject The values of the inputs of the subject creation modal
 * @returns {Promise<any>} Response from the backend when attempting to create a subject
 */
const create = async subject => {
  const body = {
    name: subject.name,
    location: subject.location,
    sunday: Boolean(subject.sunday),
    monday: Boolean(subject.monday),
    tuesday: Boolean(subject.tuesday),
    wednesday: Boolean(subject.wednesday),
    thursday: Boolean(subject.thursday),
    friday: Boolean(subject.friday),
    saturday: Boolean(subject.saturday),
    startTime:
      subject.startTime != null
        ? timeFormatter.format(subject.startTime)
        : null,
    endTime:
      subject.endTime != null ? timeFormatter.format(subject.endTime) : null,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

/**
 * Function for updating a subject
 * @param {Object} subject The values of the inputs of the subject editing modal
 * @returns {Promise<any>} The response from the backend when attempting to update the subject
 */
const update = async subject => {
  const body = {
    name: subject.name,
    location: subject.location,
    sunday: Boolean(subject.sunday),
    monday: Boolean(subject.monday),
    tuesday: Boolean(subject.tuesday),
    wednesday: Boolean(subject.wednesday),
    thursday: Boolean(subject.thursday),
    friday: Boolean(subject.friday),
    saturday: Boolean(subject.saturday),
    startTime:
      subject.startTime != null ? timeFormatter.format(subject.startTime) : '',
    endTime:
      subject.endTime != null ? timeFormatter.format(subject.endTime) : '',
    id: subject.id,
  };

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

/**
 * Function for deleting a subject
 * @param {number} id The ID number of the subject
 * @returns {Promise<any>} The response from the backend when attempting to delete the subject
 */
const deleteSubject = id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = axios.delete(url);
  return response.data;
};

/**
 * Hook for getting all subjects
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
};

/**
 * Hook for getting all subjects on a day of the week
 * @param {number} day Number representing the day of the week, 0 being Sunday, 6 being Saturday
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetSubjectsOnDay = day => {
  return useQuery({
    queryKey: ['subjects', day],
    queryFn: getSubjectsOnDay,
  });
};

/**
 * Hook for creating a subject
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useCreateSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create subject');
    },
  });
};

/**
 * Hook for updating a subject
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useUpdateSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return update(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update subject');
    },
  });
};

/**
 * Hook for deleting a subject
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useDeleteSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => {
      return deleteSubject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete subject');
    },
  });
};
