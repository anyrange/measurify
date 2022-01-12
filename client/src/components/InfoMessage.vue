<template>
  <div class="text-center">
    <h3 class="mt-1 text-base font-semibold text-gray-500-spotify">
      <slot>{{ message }}</slot>
    </h3>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});

const messages = {
  error: "An error occurred",
  empty: "Nothing found",
};

const message = messages[props.type];
</script>
