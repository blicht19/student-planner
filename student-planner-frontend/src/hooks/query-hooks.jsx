import { useCreateAssignment } from './assignments';
import { useCreateTask } from './tasks/task-hooks.jsx';
import { useCreateEvent } from './events';

const hooksMap = {
  Assignment: {
    create: useCreateAssignment,
  },
  Task: {
    create: useCreateTask,
  },
  Event: {
    create: useCreateEvent,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};
