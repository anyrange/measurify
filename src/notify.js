import $store from "@/store/";

/**
 * @param {('success'|'warning'|'danger')} type
 */

const notification = {
  show: ({ message, type, delay = 3000, progress = true }) => {
    $store.dispatch("addNotification", {
      message: message,
      type: type,
      delay: delay,
      progress: progress,
    });
  },
  reset: () => {
    $store.dispatch("resetNotifications");
  },
};

const notify = (app) => {
  app.config.globalProperties.$notify = notification;
};

export { notification, notify };
