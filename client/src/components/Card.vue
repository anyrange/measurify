<template>
  <div
    class="
      bg-gray-700-spotify bg-opacity-50
      flex flex-col
      break-inside
      rounded-lg
      w-auto
      mb-4
      p-2
    "
  >
    <div class="flex flex-row items-center gap-3">
      <span class="text-green-500-spotify text-lg font-bold">
        {{ formattedTitle }}
      </span>
      <slot name="title"></slot>
    </div>
    <div class="text-white text-base font-normal lowercase">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    title: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    formattedTitle() {
      if (typeof this.title === "number")
        return this.title.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return this.title;
    },
  },
};
</script>
