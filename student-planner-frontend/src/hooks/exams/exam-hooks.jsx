import { dateFormatter, handleQueryError, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/exams';

/**
 * Function for creating a new exam
 * @param {Object} exam Object containing the values of the inputs of the exam creation modal
 * @returns {Promise<any>} Response from the backend when attempting to create an exam
 */
const create = async exam => {
  const body = {
    name: exam.name,
    date: dateFormatter.format(exam.date),
    startTime: timeFormatter.format(exam.startTime),
    endTime: timeFormatter.format(exam.endTime),
    subjectId: exam.subject,
    location: exam.location,
    note: exam.note,
    id: exam.id,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

/**
 * Function for updating an exam
 * @param {Object} exam Object containing the values of the inputs of the exam editing modal
 * @returns {Promise<any>} Response from the backend when attempting to update an exam
 */
const update = async exam => {
  const body = {
    name: exam.name,
    date: dateFormatter.format(exam.date),
    startTime: timeFormatter.format(exam.startTime),
    endTime: timeFormatter.format(exam.endTime),
    subjectId: exam.subject !== '' ? exam.subject : 0,
    location: exam.location,
    note: exam.note,
    id: exam.id,
  };

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

/**
 * Function for deleting an exam
 * @param {number} id The ID number of the exam
 * @returns {Promise<any>} Response from the backend when attempting to delete an exam
 */
const deleteExam = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
  return response.data;
};

/**
 * Function for getting exams in a range of dates
 * @param {any[]} queryKey The query key from the hook that should include an object with the start and end of the range of exams
 * @returns {Promise<any>} The exams returned from the backend
 */
const getExamsInRange = async ({ queryKey }) => {
  const [, range] = queryKey;
  const body = {
    startDate: range.startDate,
    endDate: range.endDate,
  };
  const response = await axios.post(`${BASE_URL}/range`, body);
  return response.data;
};

/**
 * Hook for creating an exam
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useCreateExam = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create exam');
    },
  });
};

/**
 * Hook for updating an exam
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useUpdateExam = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exam => {
      return update(exam);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update exam');
    },
  });
};

/**
 * Hook for deleting an exam
 * @param {function} success Function called if the mutation is successful
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useDeleteExam = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => {
      return deleteExam(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete exam');
    },
  });
};

/**
 * Hook for getting all exams in a range of dates
 * @param {Object} range The range of dates of exams to return
 * @param {string} range.startDate The start of the range of dates of exams to return
 * @param {string} range.endDate The end of the range of dates of exams to return
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetExamsInRange = range => {
  return useQuery({
    queryKey: ['exams', range],
    queryFn: getExamsInRange,
  });
};
