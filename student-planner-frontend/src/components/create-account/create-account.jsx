import { useRegister } from '../../hooks';
import { useCallback, useState } from 'react';
import styles from './create-account.module.css';
import { TextInput } from '../text-input';
import { Button } from '../button';
import { Link } from '../link';

export const CreateAccount = () => {
  const registerMutation = useRegister();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
  const onChangeConfirmPassword = useCallback(
    confirmPassword => {
      setConfirmPassword(confirmPassword);
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
    <div className={styles.createAccount}>
      <h1>Student Planner</h1>
      <div className={styles.inputs}>
        <TextInput
          label='Username'
          value={username}
          onChange={onChangeUsername}
        />
        <TextInput
          label='Password'
          value={password}
          onChange={onChangePassword}
          isPassword
        />
        <TextInput
          label='Confirm Password'
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          className={styles.lastTextInput}
          isPassword
        />
        <Button
          onClick={onSubmit}
          text='Create Account'
          className={styles.button}
        />
      </div>
      <Link to='/login' text='Already have an account?' />
    </div>
  );
};
