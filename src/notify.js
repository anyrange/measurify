import store from "@/store/";

/**
 * @param {('success'|'warning'|'danger')} type
 */

export const notify = {
  show: ({ message, type, delay = 3000, progress = true }) => {
    store.dispatch("addNotification", {
      notification: {
        message: message,
        type: type,
        delay: delay,
        progress: progress,
      },
    });
  },
};
