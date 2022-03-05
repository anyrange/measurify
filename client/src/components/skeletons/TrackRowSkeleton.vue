<template>
  <div class="flex flex-row items-center gap-3 rounded px-1 py-1">
    <div class="flex flex-1 flex-row items-center gap-3">
      <skeleton class="h-12 w-12 object-cover" />
      <div class="flex flex-col gap-2">
        <skeleton class="h-1.5 w-20 rounded" />
        <skeleton class="h-1.5 w-12 rounded" />
      </div>
    </div>
    <div class="hidden flex-1 md:flex">
      <skeleton class="h-1.5 w-20 rounded" />
    </div>
    <span class="hidden w-10 text-center lg:flex">
      <skeleton class="h-1.5 w-22 rounded" />
    </span>
    <div class="ml-auto mr-1 w-1/5 flex justify-end">
      <skeleton class="h-1.5 w-20 rounded" />
    </div>
  </div>
</template>
