import toast from 'react-hot-toast';

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
