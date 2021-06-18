<template>
  <img :src="imageUrl" :alt="alt" @error="setAltImg" />
</template>

<script>
export default {
  name: "BaseImg",
  props: {
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    avatar: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    setAltImg(event) {
      event.target.src = this.defaultImage;
    },
  },
  computed: {
    defaultImage() {
      if (this.avatar) return "/img/noavatar.svg";
      return "/img/noimage.svg";
    },
    imageUrl() {
      if (this.src) return this.src;
      return this.defaultImage;
    },
  },
};
</script>
