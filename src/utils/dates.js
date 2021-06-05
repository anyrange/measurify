function getFirstDayOfCurrentWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1));
}
function getLastDateOfCurrentWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(now.getDate() - ((now.getDay() ? now.getDay() : 7) - 8));
}
function getFirstDayOfPreviousWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(
    now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1) - 7
  );
}
function getLastDayOfPreviousWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(now.getDate() - (now.getDay() ? now.getDay() : 7) + 1);
}

function getFirstDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth());
}
function getLastDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1);
}
function getFirstDayOfPreviousMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1);
}
function getLastDayOfPreviousMonth() {
  const now = new Date();
  now.getFullYear(), now.getMonth(), 0;
  now.setDate(0);
  now.setHours(23);
  now.setMinutes(59);
  now.setSeconds(59);
  now.setDate;
  return new Date(now);
}

export const firstDayOfWeek = getFirstDayOfCurrentWeek();
export const lastDayOfWeek = getLastDateOfCurrentWeek();
export const firstDayOfPreviousWeek = getFirstDayOfPreviousWeek();
export const lastDayOfPreviousWeek = getLastDayOfPreviousWeek();

export const firstDayOfMonth = getFirstDayOfCurrentMonth();
export const lastDayOfMonth = getLastDayOfCurrentMonth();
export const firstDayOfPreviousMonth = getFirstDayOfPreviousMonth();
export const lastDayOfPreviousMonth = getLastDayOfPreviousMonth();

export const getFilteredArray = (array, firstDate, lastDate) =>
  array.filter((item) => {
    let date = new Date(item.date).getTime();
    return firstDate < date && date < lastDate;
  });
