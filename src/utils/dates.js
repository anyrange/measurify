export const totalOverview = [
  { plays: 2, date: "2021-05-1", duration: 6 },
  { plays: 2, date: "2021-04-30", duration: 6 },
  { plays: 2, date: "2021-04-29", duration: 6 },
  { plays: 2, date: "2021-04-28", duration: 6 },
  { plays: 2, date: "2021-04-27", duration: 6 },
  { plays: 2, date: "2021-04-26", duration: 6 },
  { plays: 2, date: "2021-04-25", duration: 6 },
  { plays: 2, date: "2021-04-24", duration: 6 },
  { plays: 2, date: "2021-04-23", duration: 6 },
  { plays: 2, date: "2021-04-22", duration: 6 },
  { plays: 2, date: "2021-04-21", duration: 6 },
  { plays: 2, date: "2021-04-20", duration: 6 },
  { plays: 2, date: "2021-04-19", duration: 6 },
  { plays: 2, date: "2021-04-18", duration: 6 },
  { plays: 2, date: "2021-04-17", duration: 6 },
  { plays: 2, date: "2021-04-16", duration: 6 },
  { plays: 2, date: "2021-04-15", duration: 6 },
  { plays: 2, date: "2021-04-14", duration: 6 },
  { plays: 2, date: "2021-04-13", duration: 6 },
  { plays: 2, date: "2021-04-12", duration: 6 },
  { plays: 2, date: "2021-04-11", duration: 6 },
  { plays: 2, date: "2021-04-10", duration: 6 },
  { plays: 2, date: "2021-04-9", duration: 6 },
  { plays: 2, date: "2021-04-8", duration: 6 },
  { plays: 2, date: "2021-04-7", duration: 6 },
  { plays: 2, date: "2021-04-6", duration: 6 },
  { plays: 2, date: "2021-04-5", duration: 6 },
  { plays: 2, date: "2021-04-4", duration: 6 },
  { plays: 2, date: "2021-04-3", duration: 6 },
  { plays: 2, date: "2021-04-2", duration: 6 },
  { plays: 2, date: "2021-04-1", duration: 6 },
  { plays: 2, date: "2021-03-31", duration: 6 },
  { plays: 2, date: "2021-03-30", duration: 6 },
  { plays: 2, date: "2021-03-29", duration: 6 },
  { plays: 2, date: "2021-03-28", duration: 6 },
  { plays: 2, date: "2021-03-27", duration: 6 },
  { plays: 2, date: "2021-03-26", duration: 6 },
  { plays: 2, date: "2021-03-25", duration: 6 },
  { plays: 2, date: "2021-03-24", duration: 6 },
  { plays: 2, date: "2021-03-23", duration: 6 },
  { plays: 2, date: "2021-03-22", duration: 6 },
  { plays: 2, date: "2021-03-21", duration: 6 },
  { plays: 2, date: "2021-03-20", duration: 6 },
  { plays: 2, date: "2021-03-19", duration: 6 },
  { plays: 2, date: "2021-03-18", duration: 6 },
  { plays: 2, date: "2021-03-17", duration: 6 },
  { plays: 2, date: "2021-03-16", duration: 6 },
  { plays: 2, date: "2021-03-15", duration: 6 },
  { plays: 2, date: "2021-03-14", duration: 6 },
  { plays: 2, date: "2021-03-13", duration: 6 },
  { plays: 2, date: "2021-03-12", duration: 6 },
  { plays: 2, date: "2021-03-11", duration: 6 },
  { plays: 2, date: "2021-03-10", duration: 6 },
  { plays: 2, date: "2021-03-9", duration: 6 },
  { plays: 2, date: "2021-03-8", duration: 6 },
  { plays: 2, date: "2021-03-7", duration: 6 },
  { plays: 2, date: "2021-03-6", duration: 6 },
  { plays: 2, date: "2021-03-5", duration: 6 },
  { plays: 2, date: "2021-03-4", duration: 6 },
  { plays: 2, date: "2021-03-3", duration: 6 },
  { plays: 2, date: "2021-03-2", duration: 6 },
  { plays: 2, date: "2021-03-1", duration: 6 },
  { plays: 2, date: "2021-02-28", duration: 6 },
  { plays: 2, date: "2021-02-27", duration: 6 },
];

export function getFirstDayOfWeek() {
  const now = new Date();
  return now.setDate(now.getDate() - now.getDay());
}
export function getLastDateOfWeek() {
  const now = new Date();
  return now.setDate(now.getDate() - now.getDay() + 7);
}
export function getFirstDayOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth());
}
export function getLastDayOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0);
}

export const firstDayOfWeek = getFirstDayOfWeek();
export const lastDayOfWeek = getLastDateOfWeek();
export const firstDayOfMonth = getFirstDayOfMonth();
export const lastDayOfMonth = getLastDayOfMonth();

export const getFilteredArray = (array, firstDate, lastDate) =>
  array.filter((item) => {
    let date = new Date(item.date).getTime();
    return firstDate < date && date < lastDate;
  });
