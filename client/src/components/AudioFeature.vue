<template>
  <div class="flex flex-col gap-2 w-auto text-white">
    <h6 class="text-sm sm:text-base font-normal truncate">
      {{ name }}
    </h6>
    <div class="bg-opacity-10 rounded-full bg-green-500-spotify">
      <div class="h-1 rounded-l-full bg-green-500-spotify" :style="barStyle">
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