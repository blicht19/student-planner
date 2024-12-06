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
    id: exam.id,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

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

const deleteExam = async id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = await axios.delete(url);
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

export const useUpdateExam = success => {
  return useMutation({
    mutationFn: exam => {
      return update(exam);
    },
    onSuccess: () => {
      success();
    },
  });
};

export const useDeleteExam = success => {
  return useMutation({
    mutationFn: id => {
      return deleteExam(id);
    },
    onSuccess: () => {
      success();
    },
  });
};
