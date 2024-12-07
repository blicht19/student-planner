import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleQueryError } from '../../utils';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/admin/users';

const getUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

const unlockUser = async userId => {
  const url = `${BASE_URL}/unlock?userId=${userId}`;

  const response = await axios.post(url);
  return response.data;
};

const deleteUser = async userId => {
  const url = `${BASE_URL}?userId=${userId}`;

  const response = await axios.delete(url);
  return response.data;
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useUnlockUser = () => {
  const queryClient = useQueryClient();
  const navigateToLogin = useNavigateToLogin();
  return useMutation({
    mutationFn: userId => {
      return unlockUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to unlock user account');
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const navigateToLogin = useNavigateToLogin();

  return useMutation({
    mutationFn: userId => {
      return deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: error => {
      handleQueryError(error, navigateToLogin, 'Failed to delete user');
    },
  });
};
