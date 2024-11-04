import { useRegister } from '../../hooks';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';

export const CreateAccount = () => {
  const registerMutation = useRegister();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const onChangeConfirmPassword = useCallback(
    e => {
      setConfirmPassword(e.target.value);
    },
    [setConfirmPassword],
  );
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      registerMutation.mutate({ username, password });
    },
    [registerMutation, username, password],
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
        <div>
          <label>Confirm Password</label>
          <input
            type='password'
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
          />
        </div>
        <button onClick={onSubmit}>Create Account</button>
      </div>
      <div>
        <p>Already have an account?</p>
        <Link to='/login'>Log in</Link>
      </div>
    </div>
  );
};
