<template>
  <div class="flex items-center gap-3 rounded bg-gray-800-spotify p-1 pr-3">
    <base-link
      class="link flex-none rounded"
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
        :image-type="type"
      />
    </base-link>
    <div class="flex flex-col gap-1">
      <base-link
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
      </base-link>
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
