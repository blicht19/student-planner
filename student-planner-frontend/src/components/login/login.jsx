import { useLogin } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { TextInput } from '../text-input';
import styles from './login.module.css';
import { Button } from '../button';
import { Link } from '../link';
import { ErrorText } from '../error-text';

/**
 * Login page for the application
 * @returns {JSX.Element}
 */
export const Login = () => {
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (loginMutation.isError) {
      setErrorText(
        loginMutation.error.response?.data ??
          'An error occurred while logging in.',
      );
    } else {
      setErrorText('');
    }
  }, [loginMutation.error, loginMutation.isError]);

  const onChangeUsername = useCallback(
    username => {
      setUsername(username);
    },
    [setUsername],
  );

  const onChangePassword = useCallback(
    password => {
      setPassword(password);
    },
    [setPassword],
  );

  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      loginMutation.mutate({ username, password });
    },
    [loginMutation, password, username],
  );

  return (
    <div className={styles.login}>
      <h1>Student Planner</h1>
      <div className={styles.inputs}>
        <TextInput
          value={username}
          onChange={onChangeUsername}
          label='Username'
          maxLength={40}
        />
        <TextInput
          value={password}
          onChange={onChangePassword}
          isPassword
          label='Password'
          className={styles.lastTextInput}
          maxLength={100}
        />
        <Button
          onClick={onSubmit}
          text='Log In'
          className={styles.button}
          isLoading={loginMutation.isPending}
        />
      </div>
      <Link to='/register' text='New User?' />
      {errorText !== '' && <ErrorText text={errorText} />}
    </div>
  );
};
