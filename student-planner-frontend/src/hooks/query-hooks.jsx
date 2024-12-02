import { useCreateAssignment } from './assignments';
import { useCreateTask } from './tasks/task-hooks.jsx';
import { useCreateEvent } from './events';
import { useCreateExam } from './exams';

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
  Exam: {
    create: useCreateExam,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};
