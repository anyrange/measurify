<template>
  <h2 class="h-title mb-6">Account</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="md:w-full lg:w-1/2 xl:w-2/6 flex flex-col gap-4">
      <router-link
        :to="{ name: 'profile', params: { id: account.customID } }"
        class="
          flex flex-row
          items-center
          p-3
          justify-between
          rounded-lg
          cursor-pointer
          duration-150
          bg-gray-700-spotify
          hover:bg-gray-600-spotify
        "
      >
        <div class="flex flex-row items-center gap-3">
          <base-img
            class="object-cover w-12 h-12 rounded-full"
            avatar
            :src="user.avatar"
            alt="profile avatar"
          />
          <div class="flex flex-col">
            <p class="text-lg font-medium text-gray-400-spotify">
              {{ user.username }}
            </p>
            <p class="text-sm text-gray-500-spotify">Open profile</p>
          </div>
        </div>
        <div class="flex flex-row items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            class="fill-current"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"
            />
          </svg>
        </div>
      </router-link>
      <base-input v-model="account.spotifyID" label="Spotify ID" disabled />
      <base-input v-model="account.customID" label="Profile URL" />
      <div class="flex items-end justify-between w-full gap-6">
        <base-select
          class="w-2/4"
          v-model="account.privacy"
          :options="$options.privacyOptions"
          label="Profile visibility"
        />
        <base-button
          class="w-1/3"
          color="white"
          rounded
          @click="updateSettings()"
          :disabled="isDisabledSubmitButton"
          :loading="loadingButton"
        >
          Save
        </base-button>
      </div>
      <toggle label="Autoupdates" v-model="account.autoUpdate" />
      <div>&nbsp;</div>
      <base-button color="negative" @click="logout()">Logout</base-button>
    </div>
  </template>
</template>

<script>
import BaseSelect from "@/components/BaseSelect";
import Toggle from "@/components/Toggle";
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import BaseImg from "@/components/BaseImg";
import { updateAccount, getAccount } from "@/api";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { BaseSelect, BaseInput, BaseButton, BaseImg, Toggle },
  data() {
    return {
      loading: true,
      loadingButton: false,
      account: {
        spotifyID: "",
        privacy: null,
        customID: "",
      },
      account_copy: {},
    };
  },
  privacyOptions: [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
    { label: "Friends only", value: "friendsOnly" },
  ],
  computed: {
    ...mapGetters({ user: "getUser" }),
    isDisabledSubmitButton() {
      const regex = new RegExp(`[a-z0-9_-]{3,26}$`);
      if (!this.account.customID.match(regex)) return true;
      if (this.compareObjects(this.account, this.account_copy)) return true;
      return false;
    },
  },
  async mounted() {
    this.account = await getAccount();
    this.copyAccount();
    this.loading = false;
  },
  methods: {
    ...mapActions(["logout", "changeAutoupdate"]),
    async updateSettings() {
      try {
        this.loadingButton = true;
        const response = await updateAccount(this.account);
        this.changeAutoupdate(this.account.autoUpdate);
        this.copyAccount();
        this.$notify.show({ type: "success", message: response.message });
      } finally {
        this.loadingButton = false;
      }
    },
    compareObjects(a, b) {
      let s = (o) =>
        Object.entries(o)
          .sort()
          .map((i) => {
            if (i[1] instanceof Object) i[1] = s(i[1]);
            return i;
          });
      return JSON.stringify(s(a)) === JSON.stringify(s(b));
    },
    copyAccount() {
      this.account_copy = Object.assign({}, this.account);
    },
  },
};
</script>
