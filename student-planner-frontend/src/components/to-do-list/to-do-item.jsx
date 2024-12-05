import { CiEdit } from 'react-icons/ci';

export const ToDoItem = props => {
  const { name, complete, dueDate, note, subject, id, type } = props;
  return (
    <div>
      <input type='checkbox' checked={complete} />
      <h4>{name}</h4>
      <h4>{dueDate}</h4>
      <CiEdit />
    </div>
  );
};
