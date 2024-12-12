import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { handleQueryError, timeFormatter } from '../../utils';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/subjects';

const getSubjects = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

const getSubjectsOnDay = async ({ queryKey }) => {
  const [, day] = queryKey;
  const dayOfWeek = new Date(Date.parse(day)).getDay();
  const url = `${BASE_URL}/day?day=${dayOfWeek}`;
  const response = await axios.get(url);
  return response.data;
};

const create = async subject => {
  const body = {
    name: subject.name,
    location: subject.location,
    sunday: Boolean(subject.sunday),
    monday: Boolean(subject.monday),
    tuesday: Boolean(subject.tuesday),
    wednesday: Boolean(subject.wednesday),
    thursday: Boolean(subject.thursday),
    friday: Boolean(subject.friday),
    saturday: Boolean(subject.saturday),
    startTime:
      subject.startTime != null
        ? timeFormatter.format(subject.startTime)
        : null,
    endTime:
      subject.endTime != null ? timeFormatter.format(subject.endTime) : null,
  };

  const response = await axios.post(BASE_URL, body);
  return response.data;
};

const update = async subject => {
  const body = {
    name: subject.name,
    location: subject.location,
    sunday: Boolean(subject.sunday),
    monday: Boolean(subject.monday),
    tuesday: Boolean(subject.tuesday),
    wednesday: Boolean(subject.wednesday),
    thursday: Boolean(subject.thursday),
    friday: Boolean(subject.friday),
    saturday: Boolean(subject.saturday),
    startTime:
      subject.startTime != null ? timeFormatter.format(subject.startTime) : '',
    endTime:
      subject.endTime != null ? timeFormatter.format(subject.endTime) : '',
    id: subject.id,
  };

  const response = await axios.put(BASE_URL, body);
  return response.data;
};

const deleteSubject = id => {
  const url = `${BASE_URL}?id=${id}`;

  const response = axios.delete(url);
  return response.data;
};

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
};

export const useGetSubjectsOnDay = day => {
  return useQuery({
    queryKey: ['subjects', day],
    queryFn: getSubjectsOnDay,
  });
};

export const useCreateSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return create(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to create subject');
    },
  });
};

export const useUpdateSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignment => {
      return update(assignment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to update subject');
    },
  });
};

export const useDeleteSubject = success => {
  const navigateToLogin = useNavigateToLogin();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: id => {
      return deleteSubject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] }).then(() => {
        success();
      });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete subject');
    },
  });
};
