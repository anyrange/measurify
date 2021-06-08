function getFirstDayOfCurrentWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let res = now.setDate(
    now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1)
  );
  const date = new Date(res);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const aboba = new Date(date.getTime() - userTimezoneOffset);
  const aboba2 = new Date(aboba).toISOString().substr(0, 10);
  return new Date(aboba2).getTime();
}
export const firstDayOfWeek = getFirstDayOfCurrentWeek();

function getLastDateOfCurrentWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(now.getDate() - ((now.getDay() ? now.getDay() : 7) - 8));
}
export const lastDayOfWeek = getLastDateOfCurrentWeek();

function getFirstDayOfPreviousWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(
    now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1) - 7
  );
}
export const firstDayOfPreviousWeek = getFirstDayOfPreviousWeek();

function getLastDayOfPreviousWeek() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.setDate(now.getDate() - (now.getDay() ? now.getDay() : 7) + 1);
}
export const lastDayOfPreviousWeek = getLastDayOfPreviousWeek();

function getFirstDayOfCurrentMonth() {
  const now = new Date();
  const res = new Date(now.getFullYear(), now.getMonth(), 2);
  const date = new Date(res).toISOString().substr(0, 10);
  return new Date(date).getTime();
}
export const firstDayOfMonth = getFirstDayOfCurrentMonth();

function getLastDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1);
}
export const lastDayOfMonth = getLastDayOfCurrentMonth();

function getFirstDayOfPreviousMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1);
}
export const firstDayOfPreviousMonth = getFirstDayOfPreviousMonth();

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
export const lastDayOfPreviousMonth = getLastDayOfPreviousMonth();
