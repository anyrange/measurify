<template>
  <h2 class="h-title mb-6">Account</h2>
  <div
    class="2xl:w-2/6 xl:w-1/2 lg:w-2/3 w-full px-4 pb-4 rounded-lg border border-gray-700-spotify"
  >
    <div class="field">
      <template v-if="user.images[0]?.url">
        <img
          :src="user.images[0]?.url"
          class="object-cover w-14 h-14 mr-3 rounded-full"
        />
      </template>
      <template v-else>
        <user-icon class="w-14 h-14 mr-3" />
      </template>
      <div class="flex flex-col">
        <p class=" text-lg font-semibold text-gray-300">
          {{ user.display_name }}
        </p>
        <p class="text-lg text-gray-400">{{ user.email }}</p>
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
          Spotiworm ID
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
          <privacy-select v-model:privacy="account.private" />
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
import PrivacySelect from "@/components/PrivacySelect";
import UserIcon from "@/components/icons/UserIcon";

export default {
  components: {
    PrivacySelect,
    UserIcon,
  },
  data() {
    return {
      loading: true,
      loadingButton: false,

      account: {
        private: true,
        customID: "",
        spotifyID: "",
      },
      account_copy: {
        private: true,
        customID: "",
      },
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isDisabledSubmitButton() {
      if (
        this.account_copy.customID != this.account.customID ||
        this.account_copy.private != this.account.private
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    add(o) {
      console.log(o);
    },
    updateSettings() {
      this.loadingButton = true;
      api
        .updateAccount(this.account)
        .then((response) => {
          alert(response.message);
          this.account_copy.private = this.account.private;
          this.account_copy.customID = this.account.customID;
        })
        .finally(() => {
          this.loadingButton = false;
        })
        .catch((error) => {
          alert(error.response.data.message);
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
          alert(error.response.data.message);
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
  @apply mt-2 p-2 border rounded border-gray-600-spotify bg-gray-700-spotify disabled:opacity-40 text-gray-400 focus:outline-none;
}
.item-select {
  @apply mt-2;
}
.save-button {
  @apply rounded-full disabled:opacity-20 px-10 py-2 mt-1 text-base font-semibold bg-white hover:bg-gray-200 text-black transition-all duration-150 ease-linear shadow outline-none focus:outline-none;
}
</style>
