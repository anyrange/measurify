<template>
  <div class="item">
    <div class="item-container">
      <h3 class="item-subject">
        {{ name }}
      </h3>
      <div class="item-bottom">
        <div>
          <span class="item-title">
            {{ beforeDecimal }}
          </span>
          <span v-show="afterDecimal" class="item-subtitle">
            .{{ afterDecimal }}
          </span>
          <span class="item-subtitle">%</span>
        </div>
      </div>
    </div>
    <div class="item-progress-container bg-green-500-spotify">
      <div class="item-progress-bar bg-green-500-spotify" :style="barStyle">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SubjectDiary",
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

<style lang="postcss" scoped>
.item {
  @apply flex flex-col rounded shadow w-36  bg-gray-700-spotify;
}
.item-container {
  @apply flex flex-col gap-2 p-2;
}
.item-subject {
  @apply text-base font-medium truncate;
}
.item-bottom {
  @apply flex justify-between;
}
.item-title {
  @apply text-lg font-medium;
}
.item-subtitle {
  @apply text-xs font-normal;
}
.item-progress-container {
  @apply rounded-b-md bg-opacity-10;
}
.item-progress-bar {
  @apply h-1 rounded-bl-md;
}
</style>
