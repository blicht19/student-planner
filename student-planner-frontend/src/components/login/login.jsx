import { useLogin } from '../../hooks';
import { useCallback, useState } from 'react';
import { TextInput } from '../text-input';
import styles from './login.module.css';
import { Button } from '../button';
import { Link } from '../link';

export const Login = () => {
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
        />
        <TextInput
          value={password}
          onChange={onChangePassword}
          isPassword
          label='Password'
          className={styles.lastTextInput}
        />
        <Button
          onClick={onSubmit}
          text='Log In'
          className={styles.button}
          isLoading={loginMutation.isPending}
        />
      </div>
      <Link to='/register' text='New User?' />
    </div>
  );
};
