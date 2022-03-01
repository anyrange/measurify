<template>
  <div class="w-full py-3 flex flex-row items-center">
    <span class="flex flex-none w-10 ml-4 text-lg font-extrabold">
      <!-- <skeleton class="w-3 h-3 rounded-full" /> -->
      {{ props.place }}
    </span>
    <div class="flex flex-row items-center">
      <div class="flex flex-col flex-none">
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
      <div class="flex flex-col gap-2 ml-3 truncate">
        <skeleton class="w-18 h-3 rounded" />
        <skeleton class="w-6 h-4 rounded" />
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
