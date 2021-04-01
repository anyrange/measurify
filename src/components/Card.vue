<template>
  <div class="p-5 bg-gray-700-spotify rounded-lg shadow-sm">
    <div class="text-xl text-gray-400-spotify">{{ title }}</div>
    <div class="flex items-center pt-1">
      <div class="text-2xl font-bold text-gray-100">
        {{ value }}
      </div>
      <template
        v-if="
          (selected == 'month' || selected == 'week') &&
            value > 0 &&
            previousValue > 0
        "
      >
        <template v-if="value - previousValue > 0">
          <span
            class="flex items-center px-2 py-0.5 mx-2 text-sm text-green-900 bg-green-200 rounded-full"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 15L12 9L6 15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <span>
              {{
                (
                  ((value - previousValue) / previousValue) *
                  100
                ).toLocaleString("fullwide", {
                  maximumFractionDigits: 0,
                })
              }}%
            </span>
          </span>
        </template>
        <template v-else>
          <span
            class="flex items-center px-2 py-0.5 mx-2 text-sm text-red-600 bg-red-100 rounded-full"
          >
            <svg
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
            <span>
              {{
                (
                  ((value - previousValue) / previousValue) *
                  100
                ).toLocaleString("fullwide", {
                  maximumFractionDigits: 0,
                })
              }}%
            </span>
          </span>
        </template>
      </template>
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
