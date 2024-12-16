import toast from 'react-hot-toast';

/**
 * Shows an error popup
 * @param {string} text The text of the error popup
 */
export const showErrorNotification = text => {
  toast.error(text, {
    iconTheme: {
      primary: 'var(--error-color)',
    },
    style: {
      color: 'var(--error-color)',
      fontFamily: 'var(--font-family), sans-serif',
    },
  });
};
