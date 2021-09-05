import dayjs from "dayjs";

const locale = {
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
};

dayjs.locale(locale, null, true);

export default locale;
