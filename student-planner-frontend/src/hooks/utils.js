export const getFilterFromQueryKey = queryKey => {
  const [, filter] = queryKey;
  return {
    startDate: filter.startDate,
    endDate: filter.endDate,
    showCompleted: Boolean(filter.showCompleted),
  };
};
