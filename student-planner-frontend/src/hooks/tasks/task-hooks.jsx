import { dateFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';

const BASE_URL = '/backend/tasks';

const create = async task => {
  if (!(task.dueDate instanceof Date)) {
    throw new Error('Due date is required');
  }

  const body = {
    name: task.name,
    complete: Boolean(task.complete),
    note: task.note,
    dueDate: dateFormatter.format(task.dueDate),
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

const getFiltered = async ({ queryKey }) => {
  const body = getFilterFromQueryKey(queryKey);

  const response = await axios.post(`${BASE_URL}/filter`, body);
  return response.data;
};

export const useCreateTask = success => {
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
  });
};

export const useGetTasksFiltered = filter => {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: getFiltered,
  });
};
