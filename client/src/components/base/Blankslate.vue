<template>
  <div class="text-center w-full">
    <div class="mt-1 text-base">
      <span class="text-white font-semibold"> Ooops </span>
      <p class="font-normal">
        <slot>{{ message }}</slot>
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: "empty",
  },
});

const messages = {
  error: "An error occurred",
  empty: "Nothing found",
};

const message = messages[props.type];
</script>
