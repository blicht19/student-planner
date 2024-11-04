import { useEffect, useState } from 'react';
import { authContext } from '../../hooks';

const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username ?? '';
};

export const AuthContextProvider = ({ children }) => {
  const [username, setUsername] = useState(getStoredUsername);
  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  return (
    <authContext.Provider value={{ username, setUsername }}>
      {children}
    </authContext.Provider>
  );
};
