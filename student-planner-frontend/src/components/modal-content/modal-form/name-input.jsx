import { TextInput } from '../../text-input';
import { useCallback, useState } from 'react';

export const NameInput = props => {
  const { name, setName, isError, setIsError } = props;
  const [errorText, setErrorText] = useState('');
  const onChange = useCallback(
    newName => {
      setName(newName);
      if (newName.length < 1) {
        setErrorText('Name is required');
        setIsError(true);
      } else {
        setIsError(false);
        setErrorText('');
      }
    },
    [setName, setIsError],
  );

  return (
    <TextInput
      label='Name'
      value={name}
      isError={isError}
      errorText={errorText}
      onChange={onChange}
      maxLength={100}
    />
  );
};
