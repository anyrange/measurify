import dayjs from "@/dayjs";

export const notEmpty = (array) => {
  return Array.isArray(array) && array.length !== 0;
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

export const getRealtiveTime = (date) => {
  return dayjs(Date.parse(date)).fromNow();
};

export const getShortRelativeTime = (date) => {
  return dayjs(Date.parse(date)).locale("s-en").fromNow(true);
};

export const formatDate = (date) => {
  return dayjs(date).format("MMM D, YYYY");
};

export const getDuration = (time) => {
  return dayjs.duration(time).format("mm:ss");
};

export const getDecimals = (number) => {
  const [before, after] = `${number}`.split(".");
  return { before, after };
};
