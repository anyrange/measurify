<template>
  <div
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
    <div
      :style="{ backgroundImage: `url('${item.image}')` }"
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
    <div class="default-border mb-4 w-full border-b sm:border-none md:mb-0">
      <div
        class="relative mx-4 mb-2 text-left sm:m-0 md:text-left sm:text-center"
      >
        <div
          id="infopage-title"
          class="line-clamp-2 font-medium text-white text-xl sm:text-2xl"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
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
