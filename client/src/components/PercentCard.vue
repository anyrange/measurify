<template>
  <div class="card">
    <div class="text-2xl text-gray-400-spotify">
      <slot />
    </div>
    <div class="flex items-center pt-1">
      <div class="text-4xl font-semibold text-gray-100 leading-tight mr-2">
        {{ value }}
      </div>
      <transition name="slide-fade">
        <template v-if="(value && previousValue) || previousValue">
          <div class="flex flex-col">
            <template v-if="value - previousValue > 0">
              <p class="text-xs text-green-500 leading-tight">▲ {{ rise }}%</p>
            </template>
            <template v-else>
              <p class="text-xs text-red-500 leading-tight">▼ {{ fall }}%</p>
            </template>
            <p class="text-xs">
              {{ value - previousValue }} since last {{ selected }}
            </p>
          </div>
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "PercentCard",
  props: {
    selected: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    previousValue: {
      type: Number,
      required: true,
    },
  },
  computed: {
    rise() {
      return (
        ((this.value - this.previousValue) / this.previousValue) *
        100
      ).toLocaleString("fullwide", {
        maximumFractionDigits: 0,
      });
    },
    fall() {
      return (
        ((this.value - this.previousValue) / this.previousValue) *
        -100
      ).toLocaleString("fullwide", {
        maximumFractionDigits: 0,
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
