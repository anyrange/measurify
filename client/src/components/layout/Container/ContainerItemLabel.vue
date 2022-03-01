<template>
  <div class="flex justify-between">
    <div class="font-medium text-white text-xl">
      <slot></slot>
    </div>
    <div>
      <slot name="options"></slot>
    </div>
  </div>
</template>
