import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './auth-context.jsx';

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
