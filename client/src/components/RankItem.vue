<template>
  <div class="flex gap-3 items-center p-1 pr-3 rounded bg-gray-800-spotify">
    <router-link
      class="link rounded flex-none"
      :to="{
        name: type,
        params: {
          ...(type === 'artist' ? { artistId: item.id } : { trackId: item.id }),
        },
      }"
    >
      <base-img
        class="
          w-18
          h-18
          shadow
          rounded
          hover:opacity-80
          transition
          duration-200
        "
        :src="item.image"
        :alt="item.name"
      />
    </router-link>
    <div class="flex flex-col gap-1">
      <router-link
        class="link"
        :to="{
          name: type,
          params: {
            ...(type === 'artist'
              ? { artistId: item.id }
              : { trackId: item.id }),
          },
        }"
      >
        {{ item.name }}
      </router-link>
      <span>
        {{ `${item.yourPlace} / ${item.userPlace}` }}
      </span>
    </div>
  </div>
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
});
</script>
