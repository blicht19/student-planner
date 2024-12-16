import { createContext, useContext } from 'react';

/**
 * React context for user information
 * @type {React.Context<string>}
 */
export const authContext = createContext('');

/**
 * Hook for using the Auth context
 * @returns {string}
 */
export const useAuthContext = () => useContext(authContext);
