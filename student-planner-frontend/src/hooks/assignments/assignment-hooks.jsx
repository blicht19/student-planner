import { dateFormatter } from '../../utils';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = '/backend/assignments';

const create = async assignment => {
  console.log(assignment);
  const body = {
    name: assignment.name,
    complete: Boolean(assignment.complete),
    subjectId: assignment.subject,
    note: assignment.note,
    dueDate: dateFormatter.format(assignment.dueDate),
  };
  console.log(body);

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

export const useCreateAssignment = success => {
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      success();
    },
  });
};
