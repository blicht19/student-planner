import { dateFormatter, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

const BASE_URL = '/backend/exams';

const create = async exam => {
  const body = {
    name: exam.name,
    date: dateFormatter.format(exam.date),
    startTime: timeFormatter.format(exam.startTime),
    endTime: timeFormatter.format(exam.endTime),
    subjectId: exam.subject,
    location: exam.location,
    note: exam.note,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

export const useCreateExam = success => {
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      success();
    },
  });
};
