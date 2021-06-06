<template>
  <h2 class="h-title mb-6">Account</h2>
  <div
    class="md:w-full lg:w-1/2 xl:w-2/6 px-4 pb-4 rounded-lg border border-gray-700-spotify"
  >
    <div class="field">
      <img
        :src="user.images[0]?.url || 'noavatar.svg'"
        class="object-cover w-14 h-14 mr-3 rounded-full"
      />
      <div class="flex flex-col">
        <p class="text-lg font-semibold text-gray-300">
          {{ user.display_name }}
        </p>
        <p class="text-lg text-gray-400">
          {{ user.email }}
        </p>
      </div>
    </div>
    <div class="field">
      <custom-input
        v-model="account.spotifyID"
        class="w-full"
        label="Spotify ID"
        disabled
      />
    </div>
    <div class="field">
      <custom-input
        v-model="account.customID"
        class="w-full"
        label="Profile URL"
      />
    </div>
    <div class="field">
      <custom-select
        v-if="!loading"
        v-model="account.private"
        :options="privacy_options"
        label="Profile type"
      />
    </div>
    <div class="field justify-end">
      <button
        id="button"
        type="button"
        class="rounded-full disabled:opacity-20 px-10 py-2 mt-1 text-base font-semibold bg-white hover:bg-gray-200 text-black transition-all duration-150 ease-linear shadow outline-none focus:outline-none"
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
import CustomSelect from "@/components/CustomSelect";
import CustomInput from "@/components/CustomInput";
import { updateAccount, getAccount } from "@/api";
import { mapGetters } from "vuex";

export default {
  components: {
    CustomSelect,
    CustomInput,
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
      accountCopy: {
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
        this.accountCopy.customID == this.account.customID &&
        this.accountCopy.private == this.account.private
      )
        return true;

      return false;
    },
  },
  methods: {
    async updateSettings() {
      this.loadingButton = true;
      const response = await updateAccount(this.account);
      this.loadingButton = false;
      this.accountCopy.private = this.account.private;
      this.accountCopy.customID = this.account.customID;
      this.$notify.show({
        type: "success",
        message: response.message,
      });
    },
  },
  async created() {
    const response = await getAccount();
    this.account = {
      private: response.private,
      spotifyID: response.spotifyID,
      customID: response.customID,
    };
    this.accountCopy = {
      private: response.private,
      customID: response.customID,
    };
    this.loading = false;
  },
};
</script>

<style lang="postcss" scoped>
.field {
  @apply flex flex-row items-center mt-4;
}
</style>
