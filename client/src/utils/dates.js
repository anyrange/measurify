export default {
  get firstDayOfWeek() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let res = now.setDate(
      now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1)
    );
    const date = new Date(res);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const date2 = new Date(date.getTime() - userTimezoneOffset);
    const date3 = new Date(date2).toISOString().substr(0, 10);
    return new Date(date3).getTime();
  },
  get lastDayOfWeek() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.setDate(now.getDate() - ((now.getDay() ? now.getDay() : 7) - 8));
  },
  get firstDayOfPreviousWeek() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.setDate(
      now.getDate() - ((now.getDay() ? now.getDay() : 7) - 1) - 7
    );
  },
  get lastDayOfPreviousWeek() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.setDate(now.getDate() - (now.getDay() ? now.getDay() : 7) + 1);
  },
  get firstDayOfMonth() {
    const now = new Date();
    const res = new Date(now.getFullYear(), now.getMonth(), 2);
    const date = new Date(res).toISOString().substr(0, 10);
    return new Date(date).getTime();
  },
  get lastDayOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1);
  },
  get firstDayOfPreviousMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1);
  },
  get lastDayOfPreviousMonth() {
    const now = new Date();
    now.getFullYear(), now.getMonth(), 0;
    now.setDate(0);
    now.setHours(23);
    now.setMinutes(59);
    now.setSeconds(59);
    now.setDate;
    return new Date(now);
  },
};
