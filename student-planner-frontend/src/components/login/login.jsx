import { useLogin } from '../../hooks';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { TextInput } from '../text-input';

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
    <div>
      <h1>Student Planner</h1>
      <div>
        <TextInput
          value={username}
          onChange={onChangeUsername}
          label='Username'
          errorText='test'
        />
        <TextInput
          value={password}
          onChange={onChangePassword}
          isPassword
          label='Password'
        />
        <button onClick={onSubmit}>Log In</button>
      </div>
      <div>
        <p>New User?</p>
        <Link to={'/register'}>Create an account</Link>
      </div>
    </div>
  );
};
