import { useEffect, useState } from 'react';
import { authContext } from '../../hooks';

const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username ?? '';
};

const getStoredUserId = () => {
  const userId = localStorage.getItem('userId');
  return userId ?? '';
};

export const AuthContextProvider = ({ children }) => {
  const [username, setUsername] = useState(getStoredUsername);
  const [userId, setUserId] = useState(getStoredUserId);

  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('userId', userId);
  }, [username, userId]);

  return (
    <authContext.Provider value={{ username, setUsername, userId, setUserId }}>
      {children}
    </authContext.Provider>
  );
};
