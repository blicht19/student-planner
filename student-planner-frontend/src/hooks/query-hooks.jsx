import {
  useCreateAssignment,
  useDeleteAssignment,
  useGetAssignmentsFiltered,
  useUpdateAssignment,
} from './assignments';
import {
  useCreateTask,
  useDeleteTask,
  useGetTasksFiltered,
  useUpdateTask,
} from './tasks';
import { useCreateEvent, useDeleteEvent, useUpdateEvent } from './events';
import { useCreateExam, useDeleteExam, useUpdateExam } from './exams';
import {
  useCreateSubject,
  useDeleteSubject,
  useUpdateSubject,
} from './subjects';
import { useMemo } from 'react';
import { compareDateStrings } from '../utils';
import { modalMenuOptions } from '../components/modal-content/modal-menu-options.js';

const hooksMap = {
  Assignment: {
    create: useCreateAssignment,
    update: useUpdateAssignment,
    delete: useDeleteAssignment,
  },
  Task: {
    create: useCreateTask,
    update: useUpdateTask,
    delete: useDeleteTask,
  },
  Event: {
    create: useCreateEvent,
    update: useUpdateEvent,
    delete: useDeleteEvent,
  },
  Exam: {
    create: useCreateExam,
    update: useUpdateExam,
    delete: useDeleteExam,
  },
  Class: {
    create: useCreateSubject,
    update: useUpdateSubject,
    delete: useDeleteSubject,
  },
};

export const useCreate = (type, onSuccess) => {
  return hooksMap[type].create(onSuccess);
};

export const useUpdate = (type, onSuccess) => {
  return hooksMap[type].update(onSuccess);
};

export const useDelete = (type, onSuccess) => {
  return hooksMap[type].delete(onSuccess);
};

export const useGetAssignmentsAndTasksFiltered = filter => {
  const {
    isLoading: assignmentsAreLoading,
    isError: assignmentsAreError,
    data: assignments,
  } = useGetAssignmentsFiltered(filter);
  const {
    isLoading: tasksAreLoading,
    isError: tasksAreError,
    data: tasks,
  } = useGetTasksFiltered(filter);

  const isLoading = useMemo(() => {
    return assignmentsAreLoading || tasksAreLoading;
  }, [assignmentsAreLoading, tasksAreLoading]);

  const isError = useMemo(() => {
    return assignmentsAreError || tasksAreError;
  }, [assignmentsAreError, tasksAreError]);

  const data = useMemo(() => {
    if (isLoading || isError) {
      return undefined;
    }

    const assignmentData = [...assignments];
    assignmentData.forEach(assignment => {
      assignment.type = modalMenuOptions.assignment;
    });
    const taskData = [...tasks];
    taskData.forEach(task => {
      task.type = modalMenuOptions.task;
    });

    const combinedArray = assignmentData.concat(taskData);
    combinedArray.sort((a, b) => compareDateStrings(a.dueDate, b.dueDate));
    return combinedArray;
  }, [assignments, isError, isLoading, tasks]);

  return { isLoading, isError, data };
};
