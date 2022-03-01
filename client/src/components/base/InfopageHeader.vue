<template>
  <figure
    class="
      -mt-4
      -mx-4
      sm:m-0
      md:flex-row
      sm:items-center
      flex flex-col
      items-start
      duration-300
      static
      sm:gap-4
      gap-2
    "
  >
    <base-img
      parallax
      :src="item.image"
      :alt="item.name"
      :image-type="type"
      class="
        w-full
        h-92
        sm:w-40 sm:h-40
        md:w-48 md:h-48
        sm:rounded-full
        md:rounded-lg
        flex flex-none
        duration-300
        sm:bg-local sm:bg-cover
        bg-no-repeat bg-top bg-fixed bg-contain
        sm:mb-4
        mb-0
      "
    />
    <div class="w-full sm:border-none border-b default-border sm:mb-0 mb-4">
      <figcaption class="relative mx-4 mb-2 sm:m-0">
        <spotify-link
          :link="`https://open.spotify.com/track/${item.id}`"
          id="infopage-title"
        >
          {{ item.name }}
        </spotify-link>
      </figcaption>
    </div>
  </figure>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});
</script>
