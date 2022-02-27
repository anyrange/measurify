<template>
  <h1 class="h-title mb-4">Account</h1>
  <suspense>
    <account-details />
    <template #fallback>
      <loading-spinner />
    </template>
  </suspense>
</template>
