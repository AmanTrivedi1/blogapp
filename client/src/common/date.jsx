let months = [
  "Jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
let days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const getDay = (timestamp) => {
  let date = new Date(timestamp);
  return `${date.getDate()} ${months[date.getMonth()]}`;
};
