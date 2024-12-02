import { useCreateAssignment } from './assignments';
import { useCreateTask } from './tasks/task-hooks.jsx';

const hooksMap = {
  Assignment: {
    create: useCreateAssignment,
  },
  Task: {
    create: useCreateTask,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};
