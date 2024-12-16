import { TextInput } from '../../text-input';
import { useCallback, useState } from 'react';
import { useModalContext } from '../../../hooks';

/**
 * Input field for the name of an agenda item
 * @param {Object} props props
 * @param {boolean} props.isError Indicates whether this input has an error
 * @param {function} props.setIsError Function for updating the error state of this input
 * @returns {JSX.Element}
 */
export const NameInput = props => {
  const { item, updateItemProperty } = useModalContext();
  const { isError, setIsError } = props;
  const [errorText, setErrorText] = useState('');
  const onChange = useCallback(
    newName => {
      updateItemProperty('name', newName);
      if (newName.length < 1) {
        setErrorText('Name is required');
        setIsError(true);
      } else {
        setIsError(false);
        setErrorText('');
      }
    },
    [setIsError, updateItemProperty],
  );

  return (
    <TextInput
      label='Name'
      value={item.name}
      isError={isError}
      errorText={errorText}
      onChange={onChange}
      maxLength={100}
    />
  );
};
