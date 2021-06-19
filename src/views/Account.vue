<template>
  <h2 class="h-title mb-6">Account</h2>
  <loading-spinner v-if="loading" />
  <template v-else>
    <div class="md:w-full lg:w-1/2 xl:w-2/6 flex flex-col gap-4">
      <router-link
        :to="{ name: 'profile', params: { id: account.customID.current } }"
        class="flex flex-row items-center p-3 justify-between rounded-lg cursor-pointer duration-150 bg-gray-700-spotify hover:bg-gray-600-spotify"
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
            <p class="text-sm text-gray-500-spotify">
              Open profile
            </p>
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
      <base-input v-model="user.email" label="Spotify Email" disabled />
      <base-input v-model="account.spotifyID" label="Spotify ID" disabled />
      <base-input v-model="account.customID.current" label="Profile URL" />
      <div class="flex items-end justify-between w-full gap-6">
        <base-select
          class="w-2/4"
          v-model="account.privacy.current"
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
      <div>&nbsp;</div>
      <base-button color="negative" @click="logout()">
        Logout
      </base-button>
    </div>
  </template>
</template>

<script>
import BaseSelect from "@/components/BaseSelect";
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import BaseImg from "@/components/BaseImg";
import { updateAccount, getAccount } from "@/api";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { BaseSelect, BaseInput, BaseButton, BaseImg },
  data() {
    return {
      loading: true,
      loadingButton: false,
      account: {
        spotifyID: "",
        privacy: {
          current: null,
          previous: null,
        },
        customID: {
          current: "",
          previous: "",
        },
      },
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
      const customID = this.account.customID.current.toLowerCase();
      const customIDPrev = this.account.customID.previous.toLowerCase();
      const privacy = this.account.privacy.current;
      const privacyPrev = this.account.privacy.previous;

      const regex = new RegExp(`[A-Za-z0-9_-]{3,26}$`);
      if (!customID.match(regex)) return true;

      if (customIDPrev == customID && privacy == privacyPrev) return true;

      return false;
    },
  },
  methods: {
    ...mapActions(["logout"]),
    async updateSettings() {
      try {
        this.loadingButton = true;
        const account = {
          spotifyID: this.account.spotifyID,
          privacy: this.account.privacy.current,
          customID: this.account.customID.current.toLowerCase(),
        };
        const response = await updateAccount(account);
        this.account.privacy.previous = this.account.privacy.current;
        this.account.customID.previous = this.account.customID.current;

        this.$notify.show({
          type: "success",
          message: response.message,
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingButton = false;
      }
    },
  },
  async created() {
    const response = await getAccount();
    this.account = {
      spotifyID: response.spotifyID,
      privacy: {
        current: response.privacy,
        previous: response.privacy,
      },
      customID: {
        current: response.customID,
        previous: response.customID,
      },
    };
    this.loading = false;
  },
};
</script>
