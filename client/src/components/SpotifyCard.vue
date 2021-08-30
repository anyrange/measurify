<template>
  <router-link
    :to="{ name: type, params: { id: item.id } }"
    class="
      bg-gray-700-spotify bg-opacity-20
      hover:bg-opacity-60
      flex flex-shrink-0 flex-none flex-col
      items-center
      duration-75
      rounded-md
      gap-3
      p-3
    "
  >
    <base-img
      :src="item.image"
      :alt="item.name"
      :image-type="type"
      class="w-32 h-32 object-cover shadow-lg"
      :class="[type === 'artist' ? 'rounded-full' : 'rounded-md']"
    />

    <span class="text-white text-sm truncate w-32 text-center">
      {{ item.name }}
    </span>
  </router-link>
</template>

<script>
import BaseImg from "@/components/BaseImg";

export default {
  name: "SotifyCard",
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
