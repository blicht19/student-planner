import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth-context.jsx';

const BASE_URL = '/backend/auth';

/**
 * Function for creating a new user
 * @param {string} username The new user's username
 * @param {string} password The new user's password
 * @returns {Promise<any>} Response from the backend when attempting to create a new user
 */
const register = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/register`, {
    username,
    password,
  });

  return response.data;
};

/**
 * Function for logging a user into the application
 * @param {string} username The user's username
 * @param {string} password The user's password
 * @returns {Promise<any>} Response form the backend when attempting to log the user in
 */
const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });

  return response.data;
};

/**
 * Function for logging the user out of the application
 * @returns {Promise<any>} Response from the backend when attempting to log the user out
 */
const logout = async () => {
  const response = await axios.post(`${BASE_URL}/logout`);

  return response.data;
};

/**
 * Hook for registering a new user
 * @returns {UseMutationResult<*, DefaultError, {readonly username?: *, readonly password?: *}, unknown>}
 */
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ username, password }) => {
      return register(username, password);
    },
    onSuccess() {
      navigate('/login');
    },
  });
};

/**
 * Hook for logging a user in
 * @returns {UseMutationResult<*, DefaultError, {readonly username?: *, readonly password?: *}, unknown>}
 */
export const useLogin = () => {
  const { setUsername, setRole } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ username, password }) => {
      return await login(username, password);
    },
    onSuccess(data) {
      setUsername(data.username);
      setRole(data.role);
      navigate('/home');
    },
  });
};

/**
 * Hook for logging a user out
 * @returns {UseMutationResult<*, DefaultError, void, unknown>}
 */
export const useLogout = () => {
  const { setUsername, setRole } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSettled() {
      setUsername('');
      setRole('');
      navigate('/login');
    },
  });
};
