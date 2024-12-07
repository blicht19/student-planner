import {
  useDeleteUser,
  useGetUsers,
  useToggle,
  useUnlockUser,
} from '../../hooks';
import { useCallback, useMemo, useState } from 'react';
import Table from 'rc-table';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Button } from '../button';

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
    width: 100,
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
    width: 50,
  },
  { title: 'Delete', dataIndex: 'delete', key: 'delete', width: 50 },
];

export const Admin = () => {
  const { isLoading, isError, data } = useGetUsers();
  const unlockUserMutation = useUnlockUser();
  const deleteUserMutation = useDeleteUser();

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
          <FaUnlockKeyhole onClick={() => unlockUserMutation.mutate(user.id)} />
        ),
        delete: <FaRegTrashCan onClick={() => onClickDelete(user.id)} />,
      };
    });
  }, [data, onClickDelete, unlockUserMutation]);

  return (
    <div>
      {isLoading && <h3>Loading...</h3>}
      {isError && <h3>Error</h3>}
      {!(isLoading || isError) && <Table columns={columns} data={tableData} />}
      {showDeleteConfirmation && (
        <div>
          <h4>Are you sure you want to delete this user account?</h4>
          <div>
            <Button text='Cancel' onClick={onCancelDelete} />
            <Button text='Confirm' onClick={onConfirmDelete} />
          </div>
        </div>
      )}
    </div>
  );
};
