import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useAuthContext } from '../../components/index.js';
import { useNavigate } from 'react-router-dom';

const BASE_URL = '/backend/auth';

const register = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/register`, {
    username,
    password,
  });

  return response.data;
};

const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/login`, {
    username,
    password,
  });

  return response.data;
};

const logout = async () => {
  const response = await axios.post(`${BASE_URL}/logout`);

  return response.data;
};

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

export const useLogin = () => {
  const { setUsername } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ username, password }) => {
      return await login(username, password);
    },
    onSuccess(data) {
      setUsername(data.username);
      navigate('/');
    },
  });
};

export const useLogout = () => {
  const { setUsername } = useAuthContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSettled() {
      setUsername('');
      navigate('/login');
    },
  });
};
