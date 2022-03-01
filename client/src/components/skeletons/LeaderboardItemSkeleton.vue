<template>
  <div class="w-full flex flex-row items-center py-3">
    <span class="ml-4 w-10 flex flex-none font-extrabold text-lg">
      {{ props.place }}
    </span>
    <div class="flex flex-row items-center">
      <div class="flex flex-none flex-col">
        <div>
          <div class="relative">
            <div
              class="
                text-white
                object-cover
                w-13
                h-13
                rounded-full
                bg-gray-600-spotify
                animate-pulse
              "
            >
              &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div class="ml-3 flex flex-col gap-2 truncate">
        <skeleton class="h-3 w-18 rounded" />
        <skeleton class="h-4 w-6 rounded" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  place: {
    type: Number,
    required: true,
  },
});
</script>
