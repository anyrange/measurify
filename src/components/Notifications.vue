<template>
  <div class="absolute bottom-12 md:bottom-0 left-0 p-4 z-40 overflow-x-hidden">
    <transition-group
      enter-to-class="opacity-100 scale-100"
      enter-active-class="transition ease-out duration-200 transform opacity-0 scale-75"
      leave-active-class="transition ease-in duration-100 transform opacity-0 scale-75"
    >
      <notification
        v-for="notification in notifications"
        :key="notification"
        :notification="notification"
        @close-notification="removeNotification({ notification })"
        transition="fade"
      >
      </notification>
    </transition-group>
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
  },
  methods: {
    ...mapActions({
      removeNotification: "removeNotification",
    }),
  },
};
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transition: opacity 0.25s ease-in-out;
}
</style>
