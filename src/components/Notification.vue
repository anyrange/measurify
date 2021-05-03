<template>
  <div
    class="flex items-center mt-4 p-2 bg-gray-700-spotify rounded-full text-teal text-sm callout animated"
    :class="{
      'text-green-500': this.notification.type === 'success',
      'text-yellow-500': this.notification.type === 'warning',
      'text-red-500': this.notification.type === 'danger',
    }"
  >
    <span class="inline-flex pl-2 pr-3">{{ notification.message }}</span>
    <span
      class="inline-flex bg-gray-600-spotify text-gray-500-spotify rounded-full h-6 w-6 justify-center items-center"
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
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeNotification(notification) {
      this.$emit("close-notification", notification);
    },
  },
};
</script>

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
