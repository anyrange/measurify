<template>
  <h1 class="my-4 h-title">Account</h1>
  <div class="flex flex-col gap-4 md:w-full lg:w-1/2 2xl:w-2/6">
    <profile-badge />
    <template v-if="!loading">
      <base-input
        v-model="account.display_name"
        :loading="loading"
        label="Display Name"
      />
    </template>
    <template v-else>
      <field-skeleton />
    </template>
    <template v-if="!loading">
      <base-input
        v-model="account.username"
        label="Username"
        :loading="loading"
      />
    </template>
    <template v-else>
      <field-skeleton />
    </template>
    <div class="w-full flex items-end justify-between">
      <div class="w-2/4">
        <template v-if="!loading">
          <base-select
            v-model="account.privacy"
            :options="PRIVACY_OPTIONS"
            label="Profile visibility"
          />
        </template>
        <template v-else>
          <field-skeleton />
        </template>
      </div>
      <base-button
        class="w-1/3"
        color="white"
        shape="round"
        :disabled="loading ? true : isDisabledSubmitButton"
        :loading="loadingButton"
        @click="updateSettings"
      >
        Save
      </base-button>
    </div>
    <base-button color="red" @click="userStore.logout"> Logout </base-button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { updateAccount, getAccount } from "@/api";
import { deepEqual } from "@/utils";
import { createAsyncProcess } from "@/composable/useAsync";
import { PRIVACY_OPTIONS } from "@/config";
import { notify } from "@/services/notify";
import { useUserStore } from "@/stores/user";

const usernameRegex = new RegExp(`^[a-z0-9_-]{3,26}$`);
const account = ref(null);
const accountCopy = ref(null);

const userStore = useUserStore();

const isDisabledSubmitButton = computed(() => {
  return (
    !account.value.username.match(usernameRegex) ||
    deepEqual(account.value, accountCopy.value)
  );
});

const copyAccount = () => {
  const tempAcc = JSON.parse(JSON.stringify(account.value));
  accountCopy.value = tempAcc;
};

const fetchAccountSettings = async () => {
  account.value = await getAccount();
  copyAccount();
};

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

const { loading, run } = createAsyncProcess(fetchAccountSettings);

run();
</script>
