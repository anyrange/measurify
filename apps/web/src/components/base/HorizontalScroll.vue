<template>
  <div
    id="horizontal-scrollbar"
    class="flex-row flex flex-nowrap overflow-x-auto gap-2 -mx-4 sm:mx-0 px-4 py-0.5 sm:px-0.5"
    style="-webkit-overflow-scrolling: touch"
  >
    <slot></slot>
  </div>
</template>
