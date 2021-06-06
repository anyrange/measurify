<template>
  <table class="w-full table-fixed">
    <thead>
      <tr class="border-b border-gray-700-spotify">
        <th class="w-10 row-head text-left">
          #
        </th>
        <th class="w-auto row-head text-left">
          {{ name }}
        </th>
        <th class="w-2/10 row-head text-right">
          Minutes Listened
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in data"
        :key="item.id"
        class="hover:bg-gray-700-spotify border-b border-gray-700-spotify"
      >
        <td class="row text-left">
          {{ index + 1 }}
        </td>
        <td class="row">
          <div class="flex items-center">
            <img
              :src="item?.image || 'noimage.svg'"
              @error="item.image = 'noimage.svg'"
              class="object-cover w-9 h-9 rounded-full"
            />
            <div class="ml-4 hover:underline">
              <router-link :to="{ name: name, params: { id: item.id } }">
                {{ item.name }}
              </router-link>
            </div>
          </div>
        </td>
        <td class="row text-right">
          {{ item.playtime }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "RatingTable",
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
.row-head {
  @apply pb-3 px-3 font-normal text-sm capitalize leading-4;
}
.row {
  @apply py-2 px-3 text-sm leading-5 text-gray-100 overflow-ellipsis overflow-hidden whitespace-nowrap;
}
</style>
