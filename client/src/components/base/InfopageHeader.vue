<template>
  <figure
    class="
      -mt-4
      -mx-4
      flex flex-col
      items-start
      gap-2
      static
      duration-300
      md:flex-row md:gap-4
      sm:mx-0 sm:mt-4 sm:items-center sm:gap-0
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
        mb-0
        flex flex-none
        duration-300
        bg-no-repeat bg-top bg-fixed bg-contain
        md:w-48 md:h-48 md:rounded-lg
        sm:w-40 sm:h-40 sm:rounded-full sm:bg-local sm:bg-cover sm:mb-4
      "
    />
    <div class="w-full sm:border-none border-b default-border md:mb-0 mb-4">
      <figcaption
        class="relative mx-4 mb-2 sm:m-0 md:text-left sm:text-center text-left"
      >
        <h1
          id="infopage-title"
          class="text-xl sm:text-2xl font-medium text-white line-clamp-2"
        >
          {{ item.name }}
        </h1>
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
