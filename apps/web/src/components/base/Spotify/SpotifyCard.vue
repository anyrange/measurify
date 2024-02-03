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
      class="w-43 hover:bg-secondary-dark/50 duration-200 rounded-md p-3 relative flex flex-none flex-shrink-0 flex-col items-center"
    >
      <base-img
        :src="item.image"
        :alt="item.name"
        :image-type="type"
        class="h-40 w-40 object-cover shadow-lg"
        :class="[
          type === 'artist' || 'profile' ? 'rounded-full' : 'rounded-md',
        ]"
      />
      <span
        class="line-clamp-2 w-full font-medium text-center text-base font-medium text-white mt-1"
      >
        {{ item.name }}
      </span>
      <template v-if="item.plays">
        {{ item.plays }} {{ item.plays > 1 ? "plays" : "play" }}
      </template>
    </div>
  </base-link>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
    validator(value) {
      return ["profile", "artist", "album"].includes(value)
    },
  },
  item: {
    type: Object,
    required: true,
    validator(value) {
      return value.id !== undefined && value.name !== undefined
    },
  },
})
</script>
