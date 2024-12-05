import { useCreateAssignment, useGetAssignmentsFiltered } from './assignments';
import { useCreateTask, useGetTasksFiltered } from './tasks';
import { useCreateEvent } from './events';
import { useCreateExam } from './exams';
import { useCreateSubject } from './subjects';
import { useMemo } from 'react';
import { compareDateStrings } from '../utils';
import { modalMenuOptions } from '../components/modal-content/modal-menu-options.js';

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
