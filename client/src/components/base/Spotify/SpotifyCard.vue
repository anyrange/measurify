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
        w-38
        bg-secondary-darker
        hover:bg-secondary-dark/20
        duration-200
        rounded-md
        p-3
        group
        relative
        flex flex-none flex-shrink-0 flex-col
        items-center
        gap-3
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
        class="line-clamp-2 w-full font-medium text-center text-sm text-white"
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
          bg-secondary-dark
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
