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
import {
  useCreateEvent,
  useDeleteEvent,
  useGetEventsInRange,
  useUpdateEvent,
} from './events';
import {
  useCreateExam,
  useDeleteExam,
  useGetExamsInRange,
  useUpdateExam,
} from './exams';
import {
  useCreateSubject,
  useDeleteSubject,
  useGetSubjectsOnDay,
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
    error: assignmentsError,
  } = useGetAssignmentsFiltered(filter);
  const {
    isLoading: tasksAreLoading,
    isError: tasksAreError,
    data: tasks,
    error: tasksError,
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

  const isUnauthorized = useMemo(() => {
    return (
      (assignmentsAreError || tasksAreError) &&
      (assignmentsError?.response?.status === 401 ||
        tasksError?.response?.status === 401)
    );
  }, [assignmentsAreError, assignmentsError, tasksAreError, tasksError]);

  return { isLoading, isError, data, isUnauthorized };
};

export const useGetScheduleOnDay = day => {
  const range = {
    startDate: day,
    endDate: day,
  };
  const {
    isLoading: subjectsAreLoading,
    isError: subjectsAreError,
    data: subjects,
    error: subjectsError,
  } = useGetSubjectsOnDay(day);
  const {
    isLoading: examsAreLoading,
    isError: examsAreError,
    data: exams,
    error: examsError,
  } = useGetExamsInRange(range);
  const {
    isLoading: eventsAreLoading,
    isError: eventsAreError,
    data: events,
    error: eventsError,
  } = useGetEventsInRange(range);

  const isLoading = useMemo(() => {
    return subjectsAreLoading || examsAreLoading || eventsAreLoading;
  }, [eventsAreLoading, examsAreLoading, subjectsAreLoading]);
  const isError = useMemo(() => {
    return subjectsAreError || examsAreError || eventsAreError;
  }, [eventsAreError, examsAreError, subjectsAreError]);
  const isUnauthorized = useMemo(() => {
    return (
      isError &&
      (subjectsError?.response?.status === 401 ||
        examsError?.response?.status === 401 ||
        eventsError?.response?.status === 401)
    );
  }, [eventsError, examsError, isError, subjectsError]);

  const data = useMemo(() => {
    if (isLoading || isError) {
      return undefined;
    }

    const subjectsData = subjects.map(subject => {
      return {
        ...subject,
        type: modalMenuOptions.class,
      };
    });
    const examsData = exams.map(exam => {
      return {
        ...exam,
        type: modalMenuOptions.exam,
      };
    });
    const eventsData = events.map(event => {
      return {
        ...event,
        type: modalMenuOptions.event,
      };
    });

    const scheduleItems = subjectsData
      .concat(examsData)
      .concat(eventsData)
      .filter(item => {
        return Boolean(item.startTime.trim()) && Boolean(item.endTime.trim());
      });
    const scheduleItemMap = {};
    scheduleItems.forEach(item => {
      const key = `${item.type}-${item.id}`;
      scheduleItemMap[key] = item;
    });
    return scheduleItemMap;
  }, [events, exams, isError, isLoading, subjects]);

  return { isLoading, isError, data, isUnauthorized };
};
