<template>
  <div class="card">
    <div class="text-2xl text-gray-400-spotify">{{ title }}</div>
    <div class="flex items-center pt-1">
      <div class="text-4xl font-semibold text-gray-100 leading-tight mr-2">
        {{ value }}
      </div>
      <transition name="slide-fade">
        <template
          v-if="
            (selected == 'month' || selected == 'week') &&
              value > 0 &&
              previousValue > 0
          "
        >
          <div class="flex flex-col">
            <template v-if="value - previousValue > 0">
              <p class="text-xs text-green-500 leading-tight">
                ▲
                {{
                  (
                    ((value - previousValue) / previousValue) *
                    100
                  ).toLocaleString("fullwide", {
                    maximumFractionDigits: 0,
                  })
                }}%
              </p>
            </template>
            <template v-else>
              <p class="text-xs text-red-500 leading-tight">
                ▼
                {{
                  (
                    ((value - previousValue) / previousValue) *
                    -100
                  ).toLocaleString("fullwide", {
                    maximumFractionDigits: 0,
                  })
                }}%
              </p>
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
  props: {
    title: String,
    selected: String,
    value: Number,
    previousValue: Number,
  },
};
</script>

<style scoped>
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
