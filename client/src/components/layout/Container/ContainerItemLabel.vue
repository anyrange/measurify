<template>
  <div class="flex justify-between">
    <div class="text-xl text-white font-medium">
      <slot></slot>
    </div>
    <div>
      <slot name="options"></slot>
    </div>
  </div>
</template>
