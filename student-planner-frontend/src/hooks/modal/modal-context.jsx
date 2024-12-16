import { createContext, useContext } from 'react';

/**
 * React context for the state of the modal menu
 * @type {React.Context<{}>}
 */
export const modalContext = createContext({});

/**
 * Hook for using the modal context
 * @returns {{}}
 */
export const useModalContext = () => useContext(modalContext);
