import { AxiosError } from 'axios';
import { showErrorNotification } from './notify.js';

/**
 * Default error handling for queries. If the query response was 401 Unauthorized, calls the handler function. Otherwise, shows an error popup.
 * @param error The query error
 * @param {function} unauthorizedHandler Handler function for a 401 Unauthorized response
 * @param {string} defaultNotificationText Default text to be displayed if the error does not have an error message
 */
export const handleQueryError = (
  error,
  unauthorizedHandler,
  defaultNotificationText,
) => {
  const defaultText =
    defaultNotificationText != null && defaultNotificationText.trim() !== ''
      ? defaultNotificationText
      : 'Query error';
  if (error instanceof AxiosError && error.response) {
    if (error.response.status === 401) {
      unauthorizedHandler();
    } else {
      showErrorNotification(error.response.data ?? defaultText);
    }
  } else if (error instanceof Error) {
    showErrorNotification(error.message ?? defaultText);
  } else {
    showErrorNotification(defaultText);
  }
};
