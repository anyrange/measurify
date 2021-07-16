<template>
  <div ref="shit">
    <slot></slot>
    <slot name="loading"></slot>
  </div>
</template>

<script>
export default {
  name: "InfiniteScroll",
  props: {
    offset: {
      type: Number,
      required: false,
      default: 250,
    },
  },
  emits: ["load"],
  data() {
    return {
      contentWindow: null,
    };
  },
  methods: {
    handleScroll() {
      if (
        this.contentWindow.offsetHeight + this.contentWindow.scrollTop >=
        this.contentWindow.scrollHeight - this.offset
      ) {
        this.$emit("load");
      }
    },
  },
  mounted() {
    this.contentWindow = document.querySelector(".content-spotify");
    this.contentWindow.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    this.contentWindow.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
