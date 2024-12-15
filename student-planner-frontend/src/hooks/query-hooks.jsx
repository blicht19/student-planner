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
  useGetSubjects,
  useGetSubjectsOnDay,
  useUpdateSubject,
} from './subjects';
import { useMemo } from 'react';
import {
  compareDateStrings,
  dateFormatter,
  getAllDaysOnDayOfWeekInMonth,
  getStartAndEndOfMonth,
  setDateTime,
} from '../utils';
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

const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const getSubjectDataForDayOfWeek = (dateInMonth, sujects, dayOfWeek) => {
  const subjectsOnDay = sujects.filter(
    subject => subject[DAYS_OF_WEEK[dayOfWeek]],
  );
  if (subjectsOnDay.length === 0) {
    return [];
  }

  const datesOnThisDayOfWeekInMonth = getAllDaysOnDayOfWeekInMonth(
    dayOfWeek,
    dateInMonth,
  );

  const subjectData = [];
  for (const subject of subjectsOnDay) {
    for (const date of datesOnThisDayOfWeekInMonth) {
      subjectData.push({
        id: `${modalMenuOptions.class}-${subject.id}`,
        name: subject.name,
        start: setDateTime(date, subject.startTime),
        end: setDateTime(date, subject.endTime),
      });
    }
  }

  return subjectData;
};

const assembleSubjectsData = (date, subjects) => {
  if (subjects.length === 0) {
    return [];
  }

  const subjectsData = [];
  for (let i = 0; i < 7; i++) {
    subjectsData.push(...getSubjectDataForDayOfWeek(date, subjects, i));
  }

  return subjectsData;
};

const assembleTasksAndAssignmentsData = (tasks, assignments) => {
  return tasks.concat(assignments).map(item => {
    return {
      id: `${item.type}-${item.id}`,
      name: item.name,
      start: setDateTime(new Date(item.dueDate), '12:00 AM'),
      end: setDateTime(new Date(item.dueDate), '01:00 AM'),
    };
  });
};

export const useGetEventsInMonth = date => {
  const [monthStart, monthEnd] = useMemo(() => {
    return getStartAndEndOfMonth(date);
  }, [date]);
  const range = useMemo(() => {
    return {
      startDate: dateFormatter.format(monthStart),
      endDate: dateFormatter.format(monthEnd),
    };
  }, [monthEnd, monthStart]);
  const filter = useMemo(() => {
    return {
      ...range,
      showCompleted: false,
    };
  }, [range]);

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
  const {
    isLoading: subjectsAreLoading,
    isError: subjectsAreError,
    data: subjects,
    error: subjectsError,
  } = useGetSubjects();
  const {
    isLoading: tasksAreLoading,
    isError: tasksAreError,
    data: tasks,
    error: tasksError,
  } = useGetTasksFiltered(filter);
  const {
    isLoading: assignmentsAreLoading,
    isError: assignmentsAreError,
    data: assignments,
    error: assignmentsError,
  } = useGetAssignmentsFiltered(filter);

  const isLoading = useMemo(() => {
    return (
      subjectsAreLoading ||
      examsAreLoading ||
      eventsAreLoading ||
      tasksAreLoading ||
      assignmentsAreLoading
    );
  }, [
    eventsAreLoading,
    examsAreLoading,
    subjectsAreLoading,
    tasksAreLoading,
    assignmentsAreLoading,
  ]);
  const isError = useMemo(() => {
    return (
      subjectsAreError ||
      examsAreError ||
      eventsAreError ||
      tasksAreError ||
      assignmentsAreError
    );
  }, [
    eventsAreError,
    examsAreError,
    subjectsAreError,
    tasksAreError,
    assignmentsAreError,
  ]);
  const isUnauthorized = useMemo(() => {
    return (
      isError &&
      (subjectsError?.response?.status === 401 ||
        examsError?.response?.status === 401 ||
        eventsError?.response?.status === 401 ||
        tasksError?.response?.status === 401 ||
        assignmentsError?.response?.status === 401)
    );
  }, [
    eventsError,
    examsError,
    isError,
    subjectsError,
    tasksError,
    assignmentsError,
  ]);

  const data = useMemo(() => {
    if (isLoading || isError) {
      return undefined;
    }

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
    const assignmentsData = assignments.map(assignment => {
      return {
        ...assignment,
        type: modalMenuOptions.assignment,
      };
    });
    const tasksData = tasks.map(task => {
      return {
        ...task,
        type: modalMenuOptions.task,
      };
    });

    return examsData
      .concat(eventsData)
      .filter(item => {
        return (
          Boolean(item.date.trim()) &&
          Boolean(item.startTime.trim()) &&
          Boolean(item.endTime.trim())
        );
      })
      .map(item => {
        const date = new Date(item.date);
        const start = setDateTime(date, item.startTime);
        const end = setDateTime(date, item.endTime);

        return {
          id: `${item.type}-${item.id}`,
          name: item.name,
          start,
          end,
        };
      })
      .concat(assembleSubjectsData(date, subjects))
      .concat(assembleTasksAndAssignmentsData(tasksData, assignmentsData));
  }, [assignments, date, events, exams, isError, isLoading, subjects, tasks]);

  return { isLoading, isError, data, isUnauthorized };
};
