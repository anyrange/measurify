<template>
  <div
    class="relative mt-4 p-2 table rounded text-sm bg-gray-700-spotify"
    :class="{
      'text-green-500': notification.type === 'success',
      'text-yellow-500': notification.type === 'warning',
      'text-red-500': notification.type === 'danger',
    }"
  >
    <div
      v-if="notification.progress && notification.delay"
      :style="progressStyle"
      class="absolute bottom-0 left-0 h-1 rounded bg-gray-600-spotify z-50"
    ></div>
    <div class="flex flex-row items-center justify-between">
      <span class="pl-2 pr-3">{{ notification.message }}</span>
      <span
        class="rounded-full h-6 w-6 justify-center inline-flex bg-gray-600-spotify text-gray-500-spotify"
      >
        <button
          class="focus:outline-none"
          @click="closeNotification(notification)"
          aria-label="Close alert"
          type="button"
        >
          <span aria-hidden="true">&times;</span>
        </button>
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
  data() {
    return {
      interval: 0,
      timeLeft: 0,
      speed: 100,
    };
  },
  computed: {
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
    destroy() {
      clearInterval(this.interval);
    },
  },
};
</script>
