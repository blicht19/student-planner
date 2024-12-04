import { useCreateAssignment } from './assignments';
import { useCreateTask } from './tasks/task-hooks.jsx';
import { useCreateEvent } from './events';
import { useCreateExam } from './exams';
import { useCreateSubject } from './subjects';

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
  Class: {
    create: useCreateSubject,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};
