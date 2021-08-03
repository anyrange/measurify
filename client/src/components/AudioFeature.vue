<template>
  <div class="flex flex-col rounded w-36 bg-gray-700-spotify text-white">
    <div class="flex flex-col gap p-2">
      <h3 class="text-base font-medium truncate">
        {{ name }}
      </h3>
      <div>
        <span class="text-lg font-medium">{{ beforeDecimal }}</span>
        <span class="text-xs font-normal">
          {{ afterDecimal ? "." + afterDecimal : "" }}%
        </span>
      </div>
    </div>
    <div class="rounded-b-md bg-opacity-10 bg-green-500-spotify">
      <div class="h-1 rounded-bl-md bg-green-500-spotify" :style="barStyle">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AudioFeature",
  props: {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  computed: {
    beforeDecimal() {
      return (this.valueRounded + "").split(".")[0];
    },
    afterDecimal() {
      return (this.valueRounded + "").split(".")[1];
    },
    valueRounded() {
      return this.score.toFixed(2);
    },
    barStyle() {
      return {
        width: this.score + "%",
      };
    },
  },
};
</script>