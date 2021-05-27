<template>
  <h2 class="h-title mb-6">Account</h2>
  <div
    class="2xl:w-2/6 xl:w-1/2 w-full px-4 pb-4 rounded-lg border border-gray-700-spotify"
  >
    <div class="field">
      <template v-if="user.images[0]?.url">
        <img
          :src="user.images[0]?.url"
          class="object-cover w-14 h-14 mr-3 rounded-full"
        />
      </template>
      <template v-else>
        <user-icon class="text-white w-14 h-14 mr-3" />
      </template>
      <div class="flex flex-col">
        <p class=" text-lg font-semibold text-gray-300">
          {{ user.display_name }}
        </p>
        <p class="text-lg text-gray-400">
          {{ user.email }}
        </p>
      </div>
    </div>
    <div class="field">
      <div class="field-item">
        <label class="field-label" for="username">
          Spotify ID
        </label>
        <input
          class="item-input"
          :class="{ 'px-28 animate-pulse loading': loading }"
          :value="account.spotifyID"
          disabled
        />
      </div>
    </div>
    <div class="field">
      <div class="field-item">
        <label class="field-label" for="username">
          Profile URL
        </label>
        <input
          class="item-input"
          :class="{ 'px-28 animate-pulse loading': loading }"
          v-model="account.customID"
        />
      </div>
    </div>
    <div class="field">
      <div class="field-item">
        <label class="field-label" for="username">
          Profile type
        </label>
        <div class="item-select">
          <div
            v-if="loading"
            class="relative w-28 pl-3 pr-10 py-2 bg-gray-700-spotify border border-gray-600-spotify rounded shadow-sm text-left cursor-default focus:outline-none focus:ring-1 focus:ring-gray-600 sm:text-sm; animate-pulse loading"
          >
            &nbsp;
          </div>
          <custom-select
            v-else
            v-model="account.private"
            :options="privacy_options"
          />
        </div>
      </div>
    </div>
    <div class="field justify-end">
      <button
        id="button"
        type="button"
        class="save-button"
        :class="{ 'animate-pulse loading': loadingButton }"
        :disabled="isDisabledSubmitButton"
        @click="updateSettings()"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import CustomSelect from "@/components/CustomSelect";
import { UserIcon } from "@/components/icons";
import { mapGetters } from "vuex";

export default {
  components: {
    CustomSelect,
    UserIcon,
  },
  data() {
    return {
      loading: true,
      loadingButton: false,

      privacy_options: [
        {
          label: "Private",
          value: true,
        },
        {
          label: "Public",
          value: false,
        },
      ],
      account: {
        private: null,
        customID: "",
        spotifyID: "",
      },
      account_copy: {
        private: null,
        customID: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
    }),
    isDisabledSubmitButton() {
      const blacklist = this.$router.options.routes[1].children
        .map((item) => item.name)
        .join("|");

      const regex = new RegExp(`^(?!.*(?:${blacklist}))[a-z0-9_-]{3,16}$`);

      if (!this.account.customID.match(regex)) return true;
      if (
        this.account_copy.customID == this.account.customID &&
        this.account_copy.private == this.account.private
      )
        return true;

      return false;
    },
  },
  methods: {
    updateSettings() {
      this.loadingButton = true;
      api
        .updateAccount(this.account)
        .then((response) => {
          this.$notify.show({
            type: "success",
            message: response.message,
          });
          this.account_copy.private = this.account.private;
          this.account_copy.customID = this.account.customID;
        })
        .finally(() => {
          this.loadingButton = false;
        })
        .catch((error) => {
          this.$notify.show({
            type: "danger",
            message: error.response.data.message,
          });
        });
    },
    fetchSettings() {
      api
        .getAccount()
        .then((response) => {
          this.account = {
            private: response.private,
            spotifyID: response.spotifyID,
            customID: response.customID,
          };
          this.account_copy = {
            private: response.private,
            customID: response.customID,
          };
        })
        .finally(() => {
          this.loading = false;
        })
        .catch((error) => {
          this.$notify.show({
            type: "danger",
            message: error.response.data.message,
          });
        });
    },
  },
  created() {
    this.fetchSettings();
  },
};
</script>

<style lang="postcss" scoped>
.field {
  @apply flex flex-row items-center mt-4;
}
.field-item {
  @apply flex flex-col w-full;
}
.field-label {
  @apply text-gray-300 text-lg font-normal;
}
.item-input {
  @apply mt-2 p-2 border rounded border-gray-600-spotify bg-gray-700-spotify  focus:ring-1 focus:ring-gray-600 disabled:opacity-40 text-gray-400 focus:outline-none;
}
.item-select {
  @apply mt-2;
}
.save-button {
  @apply rounded-full disabled:opacity-20 px-10 py-2 mt-1 text-base font-semibold bg-white hover:bg-gray-200 text-black transition-all duration-150 ease-linear shadow outline-none focus:outline-none;
}
</style>
