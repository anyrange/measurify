<template>
  <aside
    id="friends-list"
    class="
      hidden
      xl:flex
      flex-col
      w-60
      items-center
      h-screen
      bg-gray-900-spotify bg-opacity-50
      overflow-y-auto
      gap-4
      px-3
    "
  >
    <div
      class="
        h-12
        md:flex
        flex-row
        hidden
        w-full
        items-center
        border-b
        default-border
        text-white
        select-none
      "
    >
      <span class="text-lg font-medium">Friend Activity</span>
    </div>
    <div class="h-full">
      <loading-spinner v-if="loading" />
      <div v-else class="flex flex-col gap-4 items-center">
        <friend-item
          v-for="friend in friendsSortedByLastListened"
          :key="friend.username"
          :friend="friend"
          @listening-now="handleListener"
        />
      </div>
    </div>
  </aside>
</template>

<script>
import { getFriends } from "@/api";
import { orderByDate } from "@/utils/arrays";
import FriendItem from "@/components/FriendItem.vue";

export default {
  name: "FriendsList",
  components: {
    FriendItem,
  },
  data() {
    return {
      loading: true,
      error: false,
      friends: [],
    };
  },
  computed: {
    friendsSortedByLastListened() {
      return this.orderByDate(this.friends, "lastPlayed").sort(
        (a, b) => (b.isListening || false) - (a.isListening || false)
      );
    },
  },
  async created() {
    try {
      const { friends } = await getFriends();
      this.friends = friends;
    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    orderByDate,
    handleListener(user) {
      const friend = this.friends.find((friend) => friend.username === user);
      friend.isListening = true;
    },
  },
};
</script>
