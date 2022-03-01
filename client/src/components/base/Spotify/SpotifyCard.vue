<template>
  <base-link
    :to="{
      name: type,
      params: {
        ...(type === 'artist' && { artistId: item.id }),
        ...(type === 'album' && { albumId: item.id }),
        ...(type === 'profile' && { username: item.id }),
      },
    }"
  >
    <div
      class="
        h-52
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
        class="h-32 w-32 object-cover shadow-lg"
        :class="[
          type === 'artist' || 'profile' ? 'rounded-full' : 'rounded-md',
        ]"
      />
      <span
        class="line-clamp-2 w-32 font-medium text-center text-sm text-white"
      >
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
    </div>
  </base-link>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator(value) {
      return ["profile", "artist", "album"].includes(value);
    },
  },
  item: {
    type: Object,
    required: true,
    validator(value) {
      return value.id !== undefined && value.name !== undefined;
    },
  },
});
</script>
