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
    <base-button color="gray" @click="userStore.logout">
      <div class="flex items-center gap-2">
        <icon class="block h-6 w-6" icon="ic:baseline-logout" />
        Logout
      </div>
    </base-button>
    <details>
      <summary>
        <span class="font-normal text-base text-secondary-lightest">
          Manage your data
        </span>
      </summary>
      <p class="my-2">
        This will delete your user account, all your listening data and
        everything else that goes with it.
      </p>
      <div>
        <base-button color="red" @click="isOpenedModal = true">
          Delete account
        </base-button>
      </div>
      <modal :show="isOpenedModal">
        <span class="mb-4 text-lg text-white">Are your sure?</span>
        <p class="mb-6 text-secondary-lightest">
          Delete your account and all data? This cannot be undone.
        </p>
        <div class="flex items-center justify-between gap-3">
          <div class="w-1/2">
            <base-button fullwidth color="gray" @click="isOpenedModal = false">
              Cancel
            </base-button>
          </div>
          <div class="w-1/2">
            <base-button fullwidth color="red" @click="deleteUser">
              Delete
            </base-button>
          </div>
        </div>
      </modal>
    </details>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { updateAccount, getAccount, deleteAccount } from "@/api"
import { deepEqual } from "@/utils"
import { createAsyncProcess } from "@/composable/useAsync"
import { PRIVACY_OPTIONS } from "@/config"
import { notify } from "@/services/notify"
import { useUserStore } from "@/stores/user"

const usernameRegex = new RegExp(`^[a-z0-9_-]{3,26}$`)
const account = ref(null)
const accountCopy = ref(null)

const isOpenedModal = ref(false)

const userStore = useUserStore()

const isDisabledSubmitButton = computed(() => {
  return (
    !account.value.username.match(usernameRegex) ||
    deepEqual(account.value, accountCopy.value)
  )
})

const deleteUser = async () => {
  await Promise.all([
    userStore.logout(),
    deleteAccount(),
    notify.show({
      type: "success",
      message: "Your account has been deleted.",
    }),
  ])
}

const copyAccount = () => {
  const tempAcc = JSON.parse(JSON.stringify(account.value))
  accountCopy.value = tempAcc
}

const fetchAccountSettings = async () => {
  account.value = await getAccount()
  copyAccount()
}

const runUpdateSettings = async () => {
  const response = await updateAccount(account.value)
  copyAccount()
  await userStore.updateUser()
  notify.show({
    type: "success",
    message: response.message,
  })
}

const { loading: loadingButton, run: updateSettings } =
  createAsyncProcess(runUpdateSettings)

const { loading, run } = createAsyncProcess(fetchAccountSettings)

run()
</script>
