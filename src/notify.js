import store from "@/store/";

/**
 * @param {('success'|'warning'|'danger')} type
 */

export function notify(app) {
  const notify = {
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
    reset: () => {
      store.dispatch("resetNotifications");
    },
  };
  app.config.globalProperties.$notify = notify;
}

export const notifyAPI = {
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
