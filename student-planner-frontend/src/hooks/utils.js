/**
 * Retrieves a filter for tasks or assignment from a useQuery key
 * @param {any[]} queryKey The query key of the useQuery hook
 * @returns {{endDate: string, showCompleted: boolean, startDate: string}} The filter for tasks or assignments
 */
export const getFilterFromQueryKey = queryKey => {
  const [, filter] = queryKey;
  return {
    startDate: filter.startDate,
    endDate: filter.endDate,
    showCompleted: Boolean(filter.showCompleted),
  };
};
