<template>
  <div class="fullwidth">
    <div class="-mx-4 sm:mx-0">
      <div class="flex flex-col divide-y divide-gray-700-spotify">
        <div class="row h-8 capitalize font-semibold">
          <div class="w-6">#</div>
          <div class="w-3/10">{{ name }}</div>
          <div class="w-auto text-right ml-auto">plays</div>
        </div>
        <router-link
          :to="{ name: name, params: { id: item.id } }"
          v-for="(item, index) in data"
          :key="item.id"
          class="row h-14 truncate hover:bg-gray-700-spotify text-white"
        >
          <span class="w-6">{{ index + 1 }}</span>
          <div class="w-auto flex flex-1 flex-row gap-3 items-center truncate">
            <base-img
              class="object-cover w-9 h-9 rounded-full flex-shrink-0"
              :src="item.image"
              :alt="item.name"
            />
            <span class="truncate">
              {{ item.name }}
            </span>
          </div>
          <span class="w-2/10 text-right ml-auto">
            {{ item.plays }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BaseImg from "@/components/BaseImg.vue";

export default {
  name: "RatingTable",
  components: { BaseImg },
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    name() {
      return this.title.slice(0, -1);
    },
  },
};
</script>

<style lang="postcss" scoped>
.row {
  @apply flex flex-row gap-3 items-center px-4;
}
</style>
