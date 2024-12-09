export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const compareDateStrings = (a, b) => {
  return Date.parse(a) - Date.parse(b);
};

export const compareTimeStrings = (a, b) => {};
