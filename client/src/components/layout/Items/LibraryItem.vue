<template>
  <li class="flex items-center justify-between py-2">
    <div class="w-full flex items-center">
      <span class="ml-2 w-12 font-light text-white">{{ place }}</span>
      <div class="w-full flex items-center gap-2">
        <base-img
          :src="item.image"
          :alt="item.name"
          class="h-10 w-10 flex-none object-cover"
          :class="{ 'rounded-full': type !== 'albums' }"
        />
        <base-link
          class="link line-clamp-1"
          :to="{
            name: typeToRouteName[type],
            params: {
              ...(type === 'artists' && { artistId: item.id }),
              ...(type === 'albums' && { albumId: item.id }),
              ...(type === 'tracks' && { trackId: item.id }),
            },
          }"
        >
          {{ item.name }}
        </base-link>
      </div>
    </div>
    <span class="text-right" :class="{ 'w-32': place === 1 }">
      {{ item.plays }} {{ place === 1 ? "plays" : "" }}
    </span>
  </li>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: true,
  },
  place: {
    type: Number,
    required: true,
  },
});

const typeToRouteName = {
  artists: "artist",
  albums: "album",
  tracks: "track",
};
</script>
