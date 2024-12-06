import { dateFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';

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

const getFiltered = async ({ queryKey }) => {
  const body = getFilterFromQueryKey(queryKey);

  const response = await axios.post(`${BASE_URL}/filter`, body);
  return response.data;
};

export const useCreateAssignment = success => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] }).then(() => {
        success();
      });
    },
  });
};

export const useUpdateAssignment = success => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return update(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] }).then(() => {
        success();
      });
    },
  });
};

export const useGetAssignmentsFiltered = filter => {
  return useQuery({
    queryKey: ['assignments', filter],
    queryFn: getFiltered,
  });
};
