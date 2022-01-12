<template>
  <div v-click-outside="close" class="relative inline-block">
    <button
      class="
        relative
        z-10
        block
        border border-transparent
        rounded
        default-focus
      "
      @click="toggle"
    >
      <settings-icon class="w-5 h-5 text-gray-500-spotify" />
    </button>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="
          absolute
          right-0
          z-20
          mt-1
          overflow-hidden
          rounded
          shadow-lg
          w-64
          bg-gray-700-spotify
          p-2
        "
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { clickOutside as VClickOutside } from "@/directives";

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
const close = () => {
  isOpen.value = false;
};
</script>

<style>
.slide-enter,
.slide-leave-to {
  transform: scaleY(0);
}
</style>
