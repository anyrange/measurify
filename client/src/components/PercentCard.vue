<template>
  <card :title="value">
    <slot />
    <template #title>
      <transition name="slide-fade">
        <template v-if="(value && previousValue) || previousValue">
          <div class="flex gap-2">
            <transition name="slide-fade" mode="out-in">
              <p
                v-if="value - previousValue > 0"
                class="text-xs text-green-500-spotify"
              >
                ▲ {{ rise }}%
              </p>
              <p v-else class="text-xs text-red-500">▼ {{ fall }}%</p>
            </transition>
          </div>
        </template>
      </transition>
    </template>
  </card>
</template>

<script>
import Card from "@/components/Card";

export default {
  name: "PercentCard",
  components: {
    Card,
  },
  props: {
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
  transform: translateY(5px);
  opacity: 0;
}
</style>
