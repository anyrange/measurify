<template>
  <div
    class="
      bg-gray-700-spotify bg-opacity-50
      break-inside
      rounded-md
      w-auto
      mb-2
      p-2
    "
  >
    <div class="flex flex-row items-center gap-3">
      <span class="text-green-500-spotify text-base font-bold">
        {{ formattedTitle }}
      </span>
      <slot name="title"></slot>
    </div>
    <span class="text-white text-sm lowercase">
      <slot />
    </span>
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
