<template>
  <table class="w-full table-fixed">
    <thead>
      <tr>
        <th class="history-th w-1 text-left">
          №
        </th>
        <th class="history-th w-5/10 text-left">
          {{ title.slice(0, -1) }}
        </th>
        <th class="history-th w-3/10 text-right">
          Minutes Listened
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data" :key="item.id" class="history-tr">
        <td class="history-td text-left">
          {{ index + 1 }}
        </td>
        <td class="history-td text-left">
          <div class="flex items-center">
            <img :src="item?.image || 'noimage.svg'" class="table-image" />
            <div class="ml-4">
              <template v-if="this.title == 'tracks'">
                <router-link
                  class="hover:underline"
                  :to="{
                    name: 'track',
                    params: {
                      id: item.id,
                      title: item.name,
                    },
                  }"
                >
                  {{ item.name }}
                </router-link>
              </template>
              <template v-else>
                {{ item.name }}
              </template>
            </div>
          </div>
        </td>
        <td class="history-td text-right">
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
    title: String,
    data: Object,
  },
};
</script>
