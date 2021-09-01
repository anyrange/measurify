<template>
  <h1 class="h-title">Account</h1>
  <loading-spinner v-if="loading" />
  <div v-else class="md:w-full lg:w-1/2 2xl:w-2/6 flex flex-col gap-4">
    <router-link
      v-if="user.username"
      :to="{ name: 'profile', params: { username: user.username } }"
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
        select-none
      "
    >
      <div class="flex flex-row items-center gap-3">
        <base-img
          class="object-cover w-12 h-12 rounded-full"
          image-type="profile"
          :src="user.avatar"
          alt="profile avatar"
        />
        <div class="flex flex-col">
          <p class="text-lg font-medium text-gray-400-spotify">
            {{ user.displayName }}
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
    <base-input v-model="account.display_name" label="Display Name" />
    <base-input v-model="account.username" label="Username" />
    <div class="flex items-end justify-between w-full">
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
    <base-toggle v-model="account.autoUpdate" label="Autoupdates" />
    <div>&nbsp;</div>
    <base-button color="negative" @click="logout()">Logout</base-button>
  </div>
</template>

<script>
import { updateAccount, getAccount } from "@/api";
import { mapState, mapActions } from "vuex";
import { notify } from "@/services/notify";
import { deepEqual } from "@/utils/objects";
import BaseButton from "@/components/BaseButton";
import BaseSelect from "@/components/BaseSelect";
import BaseToggle from "@/components/BaseToggle";
import BaseInput from "@/components/BaseInput";
import BaseImg from "@/components/BaseImg";

export default {
  components: {
    BaseButton,
    BaseSelect,
    BaseToggle,
    BaseInput,
    BaseImg,
  },
  data() {
    return {
      loading: true,
      loadingButton: false,
      account: {},
      accountCopy: {},
    };
  },
  privacyOptions: [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
    { label: "Friends only", value: "friendsOnly" },
  ],
  usernameRegex: new RegExp(`^[a-z0-9_-]{3,26}$`),
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    isDisabledSubmitButton() {
      return (
        !this.account.username.match(this.$options.usernameRegex) ||
        deepEqual(this.account, this.accountCopy)
      );
    },
  },
  async mounted() {
    try {
      this.account = await getAccount();
      this.copyAccount();
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    deepEqual,
    ...mapActions({
      logout: "auth/logout",
      updateUser: "auth/updateUser",
    }),
    async updateSettings() {
      try {
        this.loadingButton = true;
        const response = await updateAccount(this.account);
        this.copyAccount();
        this.updateUser();
        notify.show({ type: "success", message: response.message });
      } finally {
        this.loadingButton = false;
      }
    },
    async copyAccount() {
      this.accountCopy = Object.assign({}, this.account);
    },
  },
};
</script>
