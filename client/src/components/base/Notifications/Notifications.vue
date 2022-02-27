<template>
  <teleport to="body">
    <div class="notifications-bottom-left">
      <transition-group
        enter-to-class="opacity-100 scale-100"
        enter-active-class="transition ease-out duration-150 transform opacity-0 scale-75"
        leave-active-class="transition ease-in duration-150 transform opacity-0 scale-75"
      >
        <notification
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
          @close-notification="removeNotification(notification.id)"
        />
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from "vue";
import emitter from "@/services/emitter";

const notifications = ref([]);

const addNotification = (notification) => {
  notifications.value = [...notifications.value, notification];
  if (notification.progress && notification.delay > 0) {
    setTimeout(() => {
      removeNotification(notification.id);
    }, notification.delay);
  }
};

const removeNotification = (id) => {
  notifications.value = notifications.value.filter((item) => item.id !== id);
};

emitter.on("newNotification", (notification) => {
  addNotification(notification);
});
emitter.on("dismissNotification", (id) => {
  removeNotification(id);
});
emitter.on("clearNotifications", () => {
  notifications.value = [];
});
</script>

<style>
.notifications-bottom-left {
  @apply fixed bottom-4 left-4 z-50 overflow-x-hidden;
}
</style>
