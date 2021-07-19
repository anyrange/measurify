<template>
  <div class="notify" :class="notifyClass">
    <div
      v-if="notification.progress && notification.delay"
      :style="progressStyle"
      class="notify-progress"
    />
    <div class="notify-box">
      <span class="notify-message">{{ notification.message }}</span>
      <div v-if="notification.actions">
        <button
          v-for="(action, index) in notification.actions"
          :key="`${action}-${index}`"
          type="button"
          class="notify-action-btn"
          @click="handleAction(action.handler)"
        >
          {{ action.title }}
        </button>
      </div>
      <span
        v-if="notification.closable"
        class="notify-close"
        @click="closeNotification(notification)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="currentColor"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  emits: ["close-notification"],
  data() {
    return {
      interval: 0,
      timeLeft: 0,
      speed: 100,
    };
  },
  computed: {
    notifyClass() {
      const type = this.notification.type;
      return {
        "notify-success": type === "success",
        "notify-warning": type === "warning",
        "notify-danger": type === "danger",
        "notify-info": type === "info",
      };
    },
    timeLeftPercent() {
      return Math.round(
        (((this.timeLeft * 100) / this.notification.delay) * 100) / 100
      );
    },
    progressStyle() {
      return `width: ${this.timeLeftPercent}%; transition: width 0.1s linear;`;
    },
  },
  mounted() {
    if (this.notification.delay && this.notification.progress) {
      this.timeLeft = this.notification.delay - 100;
      this.interval = setInterval(() => this.updateTime(), this.speed);
    }
  },
  methods: {
    closeNotification(notification) {
      this.$emit("close-notification", notification);
      this.destroy();
    },
    updateTime() {
      this.timeLeft -= this.speed;
      if (this.timeLeft === 0) {
        this.destroy();
      }
    },
    handleAction(action) {
      action();
      this.closeNotification();
    },
    destroy() {
      clearInterval(this.interval);
    },
  },
};
</script>

<style lang="postcss">
.notify {
  @apply relative mt-4 p-2 table rounded text-sm bg-gray-700-spotify;
}
.notify-progress {
  @apply absolute bottom-0 left-0 h-1 rounded bg-gray-600-spotify z-50;
}
.notify-info {
  @apply text-blue-500;
}
.notify-success {
  @apply text-green-500;
}
.notify-warning {
  @apply text-yellow-500;
}
.notify-danger {
  @apply text-red-500;
}
.notify-box {
  @apply flex flex-row items-center justify-between;
}
.notify-message {
  @apply pl-2 pr-3;
}
.notify-close {
  @apply rounded-full text-gray-500-spotify justify-center inline-flex duration-150 cursor-pointer p-1 bg-gray-600-spotify hover:bg-opacity-20;
}
.notify-action-btn {
  @apply p-2 rounded-sm uppercase duration-100 hover:bg-white hover:bg-opacity-5;
}
</style>
