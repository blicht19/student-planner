import { dateFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilterFromQueryKey } from '../utils.js';

const BASE_URL = '/backend/tasks';

const assembleTaskBody = task => {
  return {
    name: task.name,
    complete: Boolean(task.complete),
    note: task.note,
    dueDate: dateFormatter.format(task.dueDate),
    id: task.id,
  };
};

const create = async task => {
  const body = assembleTaskBody(task);

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

const update = async task => {
  const body = assembleTaskBody(task);

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

const deleteTask = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
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

export const useUpdateTask = success => {
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
  });
};

export const useDeleteTask = success => {
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
  });
};

export const useGetTasksFiltered = filter => {
  return useQuery({
    queryKey: ['tasks', filter],
    queryFn: getFiltered,
  });
};
