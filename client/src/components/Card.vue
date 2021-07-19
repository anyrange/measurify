<template>
  <div class="flex flex-col p-2 bg-gray-700-spotify rounded-lg">
    <div class="text-green-500-spotify text-lg font-bold">
      {{ title }}
    </div>
    <div class="text-white text-base font-normal">
      {{ subtitle }}
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
    subtitle: {
      type: String,
      required: true,
    },
  },
};
</script>
