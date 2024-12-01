import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BASE_URL = '/backend/subjects';

const getSubjects = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  });
};
