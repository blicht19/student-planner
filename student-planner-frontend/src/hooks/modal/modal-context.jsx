import { createContext, useContext } from 'react';

export const modalContext = createContext({});
export const useModalContext = () => useContext(modalContext);
