import dayjs from "dayjs";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
import durationPlugin from "dayjs/plugin/duration";

import("./shortRelativeTime.js");

dayjs.locale("en");

dayjs.extend(durationPlugin);
dayjs.extend(relativeTimePlugin);

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
