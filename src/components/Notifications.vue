<template>
  <div class="absolute p-4 bottom-0 left-0 z-40 overflow-x-hidden">
    <transition
      enter-active-class="transition ease-out duration-100 transform opacity-0 scale-50"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75 transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-50 -translate-x-5"
    >
      <div v-if="newNotification">
        <notification
          v-for="(notification, index) in notifications"
          :key="index"
          :notification="notification"
          @close-notification="removeNotification({ notification })"
          transition="fade"
        >
          <slot></slot>
        </notification>
      </div>
    </transition>
  </div>
</template>

<script>
import Notification from "@/components/Notification";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Notification,
  },
  computed: {
    ...mapGetters({
      notifications: "getNotifications",
    }),
    newNotification() {
      if (this.notifications.length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions(["removeNotification"]),
  },
};
</script>
