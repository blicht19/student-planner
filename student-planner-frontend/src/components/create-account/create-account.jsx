import { useRegister } from '../../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './create-account.module.css';
import { TextInput } from '../text-input';
import { Button } from '../button';
import { Link } from '../link';
import { ErrorText } from '../error-text';

/**
 * The account creation page
 * @returns {JSX.Element}
 */
export const CreateAccount = () => {
  const registerMutation = useRegister();
  const [errorText, setErrorText] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameIsError, setUsernameIsError] = useState(false);
  const [usernameErrorText, setUsernameErrorText] = useState('');

  const [passwordIsError, setPasswordIsError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState('');

  const [confirmPasswordIsError, setConfirmPasswordIsError] = useState(false);
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');

  useEffect(() => {
    if (registerMutation.isError) {
      setErrorText(
        registerMutation.error.response?.data ??
          'An error occurred while creating account.',
      );
    } else {
      setErrorText('');
    }
  }, [registerMutation.error, registerMutation.isError]);

  const onChangeUsername = useCallback(username => {
    setUsername(username);
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 5) {
      setUsernameErrorText('Username must be at least 5 characters');
      setUsernameIsError(true);
    } else {
      setUsernameIsError(false);
      setUsernameErrorText('');
    }
  }, []);

  const validatePasswordsMatch = useCallback((password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordErrorText('Passwords do not match');
      setConfirmPasswordIsError(true);
    } else {
      setConfirmPasswordIsError(false);
      setConfirmPasswordErrorText('');
    }
  }, []);

  const onChangePassword = useCallback(
    password => {
      setPassword(password);
      const trimmedPassword = password.trim();
      if (trimmedPassword.length < 12) {
        setPasswordIsError(true);
        setPasswordErrorText('Password must be at least 12 characters');
      } else {
        setPasswordIsError(false);
        setPasswordErrorText('');
      }
      validatePasswordsMatch(trimmedPassword, confirmPassword.trim());
    },
    [confirmPassword, validatePasswordsMatch],
  );

  const onChangeConfirmPassword = useCallback(
    confirmPassword => {
      setConfirmPassword(confirmPassword);
      const trimmedConfirmPassword = confirmPassword.trim();
      const trimmedPassword = password?.trim();

      validatePasswordsMatch(trimmedPassword, trimmedConfirmPassword);
    },
    [password, validatePasswordsMatch],
  );

  const disabled = useMemo(() => {
    return (
      username === '' ||
      usernameIsError ||
      password === '' ||
      passwordIsError ||
      confirmPasswordIsError
    );
  }, [
    confirmPasswordIsError,
    password,
    passwordIsError,
    username,
    usernameIsError,
  ]);

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      registerMutation.mutate({ username, password });
    },
    [registerMutation, username, password],
  );

  return (
    <div className={styles.createAccount}>
      <h1>Student Planner</h1>
      <div className={styles.inputs}>
        <TextInput
          label='Username'
          value={username}
          onChange={onChangeUsername}
          isError={usernameIsError}
          errorText={usernameErrorText}
          maxLength={40}
        />
        <TextInput
          label='Password'
          value={password}
          onChange={onChangePassword}
          isError={passwordIsError}
          errorText={passwordErrorText}
          maxLength={100}
          isPassword
        />
        <TextInput
          label='Confirm Password'
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          className={styles.lastTextInput}
          isError={confirmPasswordIsError}
          errorText={confirmPasswordErrorText}
          maxLength={100}
          isPassword
        />
        <Button
          onClick={onSubmit}
          text='Create Account'
          className={styles.button}
          isLoading={registerMutation.isPending}
          disabled={disabled}
        />
      </div>
      <Link to='/login' text='Already have an account?' />
      {errorText !== '' && <ErrorText text={errorText} />}
    </div>
  );
};
