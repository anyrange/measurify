<template>
  <router-link
    :to="{
      name: type,
      params: {
        ...(type === 'artist' ? { artistId: item.id } : { albumId: item.id }),
      },
    }"
    class="
      bg-gray-700-spotify bg-opacity-20
      hover:bg-opacity-60
      flex flex-shrink-0 flex-none flex-col
      items-center
      duration-200
      rounded-md
      gap-3
      p-3
      group
      relative
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
    <div
      v-if="item.plays"
      class="
        absolute
        bottom-1/4
        right-2
        group-hover:opacity-100
        opacity-100
        sm:opacity-0
        duration-200
        bg-gray-700-spotify
        p-1
        rounded
        shadow-sm
      "
    >
      <span class="text-xs">
        {{ item.plays }} {{ item.plays > 1 ? "plays" : "play" }}
      </span>
    </div>
  </router-link>
</template>

<script>
import BaseImg from "@/components/BaseImg";

export default {
  name: "SotifyCard",
  components: {
    BaseImg,
  },
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
