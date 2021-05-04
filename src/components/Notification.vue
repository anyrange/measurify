<template>
  <div
    class="mt-4 p-2 table rounded-full text-sm bg-gray-700-spotify"
    :class="{
      'text-green-500': this.notification.type === 'success',
      'text-yellow-500': this.notification.type === 'warning',
      'text-red-500': this.notification.type === 'danger',
    }"
  >
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
  computed: {
    value() {
      return 10;
    },
  },
  methods: {
    closeNotification(notification) {
      this.$emit("close-notification", notification);
    },
  },
};
</script>
