<template>
  <div class="md:w-full lg:w-1/2 2xl:w-2/6 flex flex-col gap-4">
    <base-link
      v-if="userStore.user.username"
      :to="{ name: 'profile', params: { username: userStore.user.username } }"
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
          :src="userStore.user.avatar"
          alt="profile avatar"
        />
        <div class="flex flex-col">
          <p class="text-lg font-medium text-gray-400-spotify">
            {{ userStore.user.display_name }}
          </p>
          <p class="text-sm text-gray-500-spotify">Open profile</p>
        </div>
      </div>
      <div class="flex flex-row items-center">
        <icon class="w-6 h-6" icon="ic:baseline-keyboard-arrow-right" />
      </div>
    </base-link>
    <template v-if="account && accountCopy">
      <base-input v-model="account.display_name" label="Display Name" />
      <base-input v-model="account.username" label="Username" />
      <div class="flex items-end justify-between w-full">
        <base-select
          v-model="account.privacy"
          class="w-2/4"
          :options="PRIVACY_OPTIONS"
          label="Profile visibility"
        />
        <base-button
          class="w-1/3"
          color="white"
          shape="round"
          :disabled="isDisabledSubmitButton"
          :loading="loadingButton"
          @click="updateSettings"
        >
          Save
        </base-button>
      </div>
    </template>
    <base-button color="red" @click="userStore.logout"> Logout </base-button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { updateAccount, getAccount } from "@/api";
import { useUserStore } from "@/stores/user";
import { deepEqual } from "@/utils";
import { createAsyncProcess } from "@/composable/useAsync";
import { PRIVACY_OPTIONS } from "@/config";
import { notify } from "@/services/notify";

const userStore = useUserStore();

const usernameRegex = new RegExp(`^[a-z0-9_-]{3,26}$`);
const account = ref(null);
const accountCopy = ref(null);

const copyAccount = () => {
  const tempAcc = JSON.parse(JSON.stringify(account.value));
  accountCopy.value = tempAcc;
};

account.value = await getAccount();
copyAccount();

const isDisabledSubmitButton = computed(() => {
  return (
    !account.value.username.match(usernameRegex) ||
    deepEqual(account.value, accountCopy.value)
  );
});

const runUpdateSettings = async () => {
  const response = await updateAccount(account.value);
  copyAccount();
  await userStore.updateUser();
  notify.show({
    type: "success",
    message: response.message,
  });
};

const { loading: loadingButton, run: updateSettings } =
  createAsyncProcess(runUpdateSettings);
</script>
