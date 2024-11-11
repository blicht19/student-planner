import { useCallback, useState } from 'react';

export const useToggle = initialState => {
  const [value, setValue] = useState(initialState ?? false);
  const toggle = useCallback(() => {
    setValue(previous => !previous);
  }, [setValue]);

  return [value, toggle];
};
