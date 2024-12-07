import {
  useAuthContext,
  useDeleteUser,
  useGetUsers,
  useNavigateToLogin,
  useToggle,
  useUnlockUser,
} from '../../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Table from 'rc-table';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Button } from '../button';
import styles from './admin.module.css';
import { Modal } from '../modal';
import { GridLoader } from 'react-spinners';
import { handleQueryError } from '../../utils';

const columns = [
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 100,
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 50,
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    width: 100,
  },
  {
    title: 'Account Locked',
    dataIndex: 'accountLocked',
    key: 'accountLocked',
    width: 100,
  },
  {
    title: 'Failed Login Attempts',
    dataIndex: 'failedLoginAttempts',
    key: 'failedLoginAttempts',
    width: 125,
  },
  {
    title: 'Lock Time',
    dataIndex: 'lockTime',
    key: 'lockTime',
    width: 100,
  },
  {
    title: 'Unlock',
    dataIndex: 'unlock',
    key: 'unlock',
    width: 75,
  },
  { title: 'Delete', dataIndex: 'delete', key: 'delete', width: 75 },
];

export const Admin = () => {
  const { isLoading, isError, data, error } = useGetUsers();
  const navigateToLogin = useNavigateToLogin();
  const { username } = useAuthContext();
  const unlockUserMutation = useUnlockUser();
  const deleteUserMutation = useDeleteUser();

  useEffect(() => {
    if (isError && error) {
      handleQueryError(error, navigateToLogin, 'Failed to retrieve users');
    }
  }, [error, isError, navigateToLogin]);

  const [showDeleteConfirmation, toggleShowDeleteConfirmation] =
    useToggle(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const onClickDelete = useCallback(
    userId => {
      setUserToDelete(userId);
      toggleShowDeleteConfirmation();
    },
    [toggleShowDeleteConfirmation],
  );
  const onConfirmDelete = useCallback(() => {
    toggleShowDeleteConfirmation();
    deleteUserMutation.mutate(userToDelete);
    setUserToDelete(null);
  }, [deleteUserMutation, toggleShowDeleteConfirmation, userToDelete]);
  const onCancelDelete = useCallback(() => {
    toggleShowDeleteConfirmation();
    setUserToDelete(null);
  }, [toggleShowDeleteConfirmation]);

  const tableData = useMemo(() => {
    if (data == null) return [];
    return data.map(user => {
      return {
        username: user.username,
        id: user.id,
        role: user.role,
        accountLocked: user.accountLocked.toString(),
        failedLoginAttempts: user.failedLoginAttempts,
        lockTime: user.lockTime ?? 'Unlocked',
        key: user.id,
        unlock: (
          <FaUnlockKeyhole
            onClick={() => unlockUserMutation.mutate(user.id)}
            className={styles.adminTableIcon}
          />
        ),
        delete: (
          <FaRegTrashCan
            onClick={() => onClickDelete(user.id)}
            className={`${styles.adminTableIcon} ${styles.deleteIcon} ${user.username === username && styles.disabled}`}
          />
        ),
      };
    });
  }, [data, onClickDelete, unlockUserMutation, username]);

  return (
    <div className={styles.admin}>
      <h2>Admin</h2>
      {isLoading && <GridLoader color='var(--light-color)' />}
      {isError && (
        <h3 className={styles.errorText}>Failed to load user data</h3>
      )}
      {!(isLoading || isError) && (
        <Table
          columns={columns}
          data={tableData}
          tableLayout='fixed'
          className={styles.adminTable}
        />
      )}
      {showDeleteConfirmation && (
        <Modal closeModal={toggleShowDeleteConfirmation}>
          <div className={styles.confirmationContainer}>
            <h2 className={styles.confirmationHeader}>
              Are you sure you want to delete the account for User ID{' '}
              {userToDelete}?
            </h2>
            <div className={styles.buttons}>
              <Button text='Cancel' onClick={onCancelDelete} />
              <Button
                text='Confirm'
                onClick={onConfirmDelete}
                type='destructive'
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
