<template>
  <div class="flex flex-col gap-1 mb-4">
    <h1 class="h-title">Leaderboard</h1>
    <h2 class="h-subtitle">
      This is just a leaderboard, you can sort it by 'minutes' or 'tracks'
    </h2>
  </div>
  <suspense>
    <leaderboard-details />
    <template #fallback>
      <loading-spinner />
    </template>
  </suspense>
</template>
