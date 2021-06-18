<template>
  <h2 class="h-title mb-6">Account</h2>
  <div class="md:w-full lg:w-1/2 xl:w-2/6 flex flex-col gap-4">
    <router-link
      v-if="!loading"
      :to="{ name: 'profile', params: { id: account.customID.current } }"
      class="flex flex-row items-center p-3 justify-between rounded-lg cursor-pointer duration-150 bg-gray-700-spotify hover:bg-gray-600-spotify"
    >
      <div class="flex flex-row items-center gap-3">
        <img
          :src="user.avatar || 'noavatar.svg'"
          @error="item.image = 'noimage.svg'"
          class="object-cover w-12 h-12 rounded-full"
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
    <div class="flex items-end justify-between">
      <base-select
        v-if="!loading"
        v-model="account.private.current"
        :options="$options.privacyOptions"
        label="Profile type"
      />
      <base-button
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
    <!--
    <router-link :to="{ name: 'about' }">
      <base-button color="positive">About</base-button>
    </router-link> 
    -->
    <base-button color="negative" @click="logout()">Logout</base-button>
  </div>
</template>

<script>
import BaseSelect from "@/components/BaseSelect";
import BaseInput from "@/components/BaseInput";
import BaseButton from "@/components/BaseButton";
import { updateAccount, getAccount } from "@/api";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { BaseSelect, BaseInput, BaseButton },
  data() {
    return {
      loading: true,
      loadingButton: false,
      account: {
        spotifyID: "",
        private: {
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
    { label: "Private", value: true },
    { label: "Public", value: false },
  ],
  computed: {
    ...mapGetters({ user: "getUser" }),
    isDisabledSubmitButton() {
      const customID = this.account.customID.current.toLowerCase();
      const customIDPrev = this.account.customID.previous.toLowerCase();
      const privacy = this.account.private.current;
      const privacyPrev = this.account.private.previous;

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
          private: this.account.private.current,
          customID: this.account.customID.current.toLowerCase(),
        };
        const response = await updateAccount(account);
        this.account.private.previous = this.account.private.current;
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
      private: {
        current: response.private,
        previous: response.private,
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
