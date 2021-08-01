<template>
  <div class="flex flex-col p-2 w-32 bg-gray-700-spotify rounded-lg">
    <div class="text-green-500-spotify text-lg font-bold">
      {{ formattedTitle }}
    </div>
    <div class="text-white text-base font-normal">
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
