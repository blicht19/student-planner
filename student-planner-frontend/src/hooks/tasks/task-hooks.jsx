import { dateFormatter } from '../../utils/index.js';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

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

export const useCreateTask = success => {
  return useMutation({
    mutationFn: task => {
      return create(task);
    },
    onSuccess: () => {
      success();
    },
  });
};
