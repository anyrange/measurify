<template>
  <suspense>
    <compatibility-details />
    <template #fallback>
      <loading-spinner />
    </template>
  </suspense>
</template>

<script setup></script>
