import { useEffect, useState } from 'react';
import { authContext } from '../../hooks';

const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username ?? '';
};

const getStoredUserRole = () => {
  const role = localStorage.getItem('role');
  return role ?? '';
};

export const AuthContextProvider = ({ children }) => {
  const [username, setUsername] = useState(getStoredUsername);
  const [role, setRole] = useState(getStoredUserRole);

  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
  }, [username, role]);

  return (
    <authContext.Provider value={{ username, setUsername, role, setRole }}>
      {children}
    </authContext.Provider>
  );
};
