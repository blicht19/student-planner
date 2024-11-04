import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

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
  return useMutation({
    mutationFn: ({ username, password }) => {
      return register(username, password);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }) => {
      return login(username, password);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => {
      return logout();
    },
  });
};
