import dayjs from "dayjs"
import durationPlugin from "dayjs/plugin/duration"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import weekday from "dayjs/plugin/weekday"

const shortRealitveTime = {
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
}

dayjs.locale(shortRealitveTime, null, true)
dayjs.locale("en")

dayjs.extend(durationPlugin)
dayjs.extend(relativeTimePlugin)
dayjs.extend(weekday)

export default dayjs
