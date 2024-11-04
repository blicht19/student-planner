import { useLogin } from '../../hooks';
import { useCallback, useState } from 'react';

export const Login = () => {
  const loginMutation = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onChangeUsername = useCallback(
    e => {
      setUsername(e.target.value);
    },
    [setUsername],
  );
  const onChangePassword = useCallback(
    e => {
      setPassword(e.target.value);
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
        <div>
          <label>Username</label>
          <input type='text' value={username} onChange={onChangeUsername} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={onChangePassword} />
        </div>
        <button onClick={onSubmit}>Log In</button>
      </div>
    </div>
  );
};
