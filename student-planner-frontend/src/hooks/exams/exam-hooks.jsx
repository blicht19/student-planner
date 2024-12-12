import { dateFormatter, handleQueryError, timeFormatter } from '../../utils';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigateToLogin } from '../navigate';

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

const getExamsInRange = async ({ queryKey }) => {
  const [, range] = queryKey;
  const body = {
    startDate: range.startDate,
    endDate: range.endDate,
  };
  const response = await axios.post(`${BASE_URL}/range`, body);
  return response.data;
};

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

export const useGetExamsInRange = range => {
  return useQuery({
    queryKey: ['exams', range],
    queryFn: getExamsInRange,
  });
};
