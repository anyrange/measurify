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
