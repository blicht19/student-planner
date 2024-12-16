import { useEffect, useState } from 'react';
import { authContext } from '../../hooks';

/**
 * Gets the username stored in local storage. Returns an empty string if it is not found.
 * @returns {string} The username stored in local storage. An empty string if no username is found.
 */
const getStoredUsername = () => {
  const username = localStorage.getItem('username');
  return username ?? '';
};

/**
 * Gets the user role stored in local storage. Returns an empty string if it is not found.
 * @returns {string} The user role stored in local storage. An empty string if no user role is found.
 */
const getStoredUserRole = () => {
  const role = localStorage.getItem('role');
  return role ?? '';
};

/**
 * Context provider component for user information. Stores user information in application state and in local storage.
 * @param children Child components of this component.
 * @returns {JSX.Element}
 */
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
