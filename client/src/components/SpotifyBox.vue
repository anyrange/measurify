<template>
  <router-link :to="{ name: type, params: { id: item.id } }">
    <div class="w-20 h-20 relative">
      <base-img
        :src="item.image"
        :alt="item.name"
        class="
          absolute
          rounded-lg
          inset-0
          w-full
          h-full
          object-cover
          bg-center
          opacity-30
        "
      />
      <div
        class="
          truncate-2
          absolute
          transform
          -translate-x-1/2 -translate-y-1/2
          top-2/4
          left-2/4
          p-1
          flex
          justify-center
          items-center
          text-center text-white
          font-semibold
        "
      >
        {{ item.name }}
      </div>
    </div>
  </router-link>
</template>

<script>
import BaseImg from "@/components/BaseImg.vue";

export default {
  name: "SotifyBox",
  components: { BaseImg },
  props: {
    type: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
