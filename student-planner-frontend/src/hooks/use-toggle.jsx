import { useCallback, useState } from 'react';

/**
 * Hook for a toggleable true/false state
 * @param {boolean} [initialState = false] The initial value of the state
 * @returns {[boolean,(function(): void)]} Boolean state and function to toggle the state
 */
export const useToggle = initialState => {
  const [value, setValue] = useState(initialState ?? false);
  const toggle = useCallback(() => {
    setValue(previous => !previous);
  }, [setValue]);

  return [value, toggle];
};
