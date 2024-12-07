import { dateFormatter, handleQueryError } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/assignments';

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

const deleteAssignment = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
  return response.data;
};

const getFiltered = async ({ queryKey }) => {
  const body = getFilterFromQueryKey(queryKey);

  const response = await axios.post(`${BASE_URL}/filter`, body);
  return response.data;
};

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

export const useGetAssignmentsFiltered = filter => {
  return useQuery({
    queryKey: ['assignments', filter],
    queryFn: getFiltered,
  });
};
