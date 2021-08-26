import { formatDistanceToNowStrict, addSeconds, format } from "date-fns";

export const getDateFromNow = (date) => {
  return formatDistanceToNowStrict(Date.parse(date), { addSuffix: true });
};

export const getDateFromNowShort = (date) => {
  return formatDistanceToNowStrict(Date.parse(date));
};

export const getDuration = (time) => {
  return format(addSeconds(new Date(0), time / 1000), "mm:ss");
};
