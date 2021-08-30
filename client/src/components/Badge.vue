<template>
  <span
    class="
      bg-gray-700-spotify bg-opacity-50
      text-gray-400-spotify
      rounded
      text-sm
      flex flex-shrink-0 flex-none
      px-3
      py-1
    "
  >
    <slot />
  </span>
</template>

<script>
export default {
  name: "Badge",
};
</script>