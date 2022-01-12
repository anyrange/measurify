<template>
  <h1 class="h-title">Account</h1>
  <suspense-wrapper :loading="loading" :error="error">
    <div class="md:w-full lg:w-1/2 2xl:w-2/6 flex flex-col gap-4">
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
              {{ user.display_name }}
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
          v-model="account.privacy"
          class="w-2/4"
          :options="privacyOptions"
          label="Profile visibility"
        />
        <base-button
          class="w-1/3"
          color="white"
          rounded
          :disabled="isDisabledSubmitButton"
          :loading="loadingButton"
          @click="updateSettings()"
        >
          Save
        </base-button>
      </div>
      <div>&nbsp;</div>
      <base-button color="negative" @click="userStore.logout()">
        Logout
      </base-button>
    </div>
  </suspense-wrapper>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFetch } from "@/composable/useFetch";
import { updateAccount, getAccount } from "@/api";
import { useUserStore } from "@/stores/user";
import { deepEqual } from "@/utils";
import { notify } from "@/services/notify";
import privacyOptions from "@/assets/configs/privacyOptions.json";

const userStore = useUserStore();
const user = computed(() => userStore.user);

const { fetchData, loading, error } = useFetch();
const { fetchData: updateData, loading: loadingButton } = useFetch();

const usernameRegex = new RegExp(`^[a-z0-9_-]{3,26}$`);
const account = ref(null);
const accountCopy = ref(null);

const isDisabledSubmitButton = computed(
  () =>
    !account.value.username.match(usernameRegex) ||
    deepEqual(account.value, accountCopy.value)
);

const copyAccount = () => {
  const tempAcc = JSON.parse(JSON.stringify(account.value));
  accountCopy.value = tempAcc;
};

(async () => {
  await fetchData(async () => {
    account.value = await getAccount();
    copyAccount();
  });
})();

const updateSettings = async () => {
  await updateData(async () => {
    const response = await updateAccount(account.value);
    copyAccount();
    await userStore.updateUser();
    notify.show({ type: "success", message: response.message });
  });
};
</script>
