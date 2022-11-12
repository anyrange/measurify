import { nanoid } from "nanoid"
import emitter from "./emitter.js"

/**
 * @param {('info'|'success'|'warning'|'danger')} type
 */

export const notify = {
  show: ({
    id = nanoid(),
    message,
    type = "info",
    delay = 3000,
    progress = true,
    closable = true,
    actions = {},
  }) => {
    emitter.emit("newNotification", {
      id,
      message,
      type,
      delay,
      progress,
      closable,
      actions,
    })
  },
  dismiss: (id) => {
    emitter.emit("dismissNotification", id)
  },
  clear: () => {
    emitter.emit("clearNotifications")
  },
}
