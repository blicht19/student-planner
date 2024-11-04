import { createContext, useContext, useEffect, useState } from 'react';

const authContext = createContext('');
const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username ?? '';
};

export const useAuthContext = () => useContext(authContext);

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
