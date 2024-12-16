import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { handleQueryError } from '../../utils';
import { useNavigateToLogin } from '../navigate';

const BASE_URL = '/backend/admin/users';

/**
 * Function for fetching all users
 * @returns {Promise<any>} Users retrieved from the backend
 */
const getUsers = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Function for making a post request to unlock a user account that has been locked due to too many failed login attempts.
 * @param {number} userId The ID number of the user
 * @returns {Promise<any>} Response returned from the backend when attempting to unlock this user account
 */
const unlockUser = async userId => {
  const url = `${BASE_URL}/unlock?userId=${userId}`;

  const response = await axios.post(url);
  return response.data;
};

/**
 * Function for making a delete request to remove a user account
 * @param {number} userId The ID number of the user
 * @returns {Promise<any>} Response returned from the backend when attempting to delete this user account
 */
const deleteUser = async userId => {
  const url = `${BASE_URL}?userId=${userId}`;

  const response = await axios.delete(url);
  return response.data;
};

/**
 * Hook for getting all user data
 * @returns {UseQueryResult<any, DefaultError>}
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

/**
 * Hook for unlocking a user account that has been locked due to too many failed login attempts
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
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

/**
 * Hook for deleting a user account
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
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
