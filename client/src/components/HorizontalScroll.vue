<template>
  <div
    class="
      flex-row flex flex-nowrap
      horizontal-scrollbar
      overflow-x-auto
      gap-2
      -mx-4
      sm:mx-0
      px-4
      sm:px-0
    "
    style="-webkit-overflow-scrolling: touch"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "HorizontalScroll",
};
</script>