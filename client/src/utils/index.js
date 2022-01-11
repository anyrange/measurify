import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import relativeTimePlugin from "dayjs/plugin/relativeTime";

dayjs.locale(
  {
    name: "s-en",
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: "few s",
      m: "1 m",
      mm: "%d m",
      h: "1 h",
      hh: "%d h",
      d: "1 d",
      dd: "%d d",
      M: "1 mn",
      MM: "%d mn",
      y: "1 y",
      yy: "%d y",
    },
  },
  null,
  true
);
dayjs.locale("en");

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

export const isEmpty = (str) => {
  return !str || str.length === 0;
};

export const debounce = (fn, delay = 0, immediate = false) => {
  let timeout;
  return (...args) => {
    if (immediate && !timeout) fn(...args);
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const deepEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};

export const isObject = (object) => {
  return object != null && typeof object === "object";
};

export const orderByDate = (array, key) => {
  return array.sort(
    (a, b) => new Date(b[key]).getTime() - new Date(a[key]).getTime()
  );
};

export const getDateFromNow = (date) => {
  return dayjs(Date.parse(date)).fromNow();
};

export const getDateFromNowShort = (date) => {
  return dayjs(Date.parse(date)).locale("s-en").fromNow(true);
};

export const formatDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

export const getDuration = (time) => {
  return dayjs.duration(time).format("mm:ss");
};
