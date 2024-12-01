import { useCreateAssignment } from './assignments';

const hooksMap = {
  Assignment: {
    create: useCreateAssignment,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};
