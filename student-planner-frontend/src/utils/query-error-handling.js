import { AxiosError } from 'axios';
import { showErrorNotification } from './notify.js';

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
