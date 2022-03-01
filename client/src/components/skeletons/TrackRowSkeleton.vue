<template>
  <div class="flex flex-row items-center rounded gap-3 px-1 py-1">
    <div class="flex flex-row flex-1 truncate items-center gap-3">
      <skeleton class="w-12 h-12 object-cover" />
      <div class="flex flex-col gap-2">
        <skeleton class="w-20 h-1.5 rounded" />
        <skeleton class="w-12 h-1.5 rounded" />
      </div>
    </div>
    <div class="flex-1 md:flex hidden truncate">
      <skeleton class="w-20 h-1.5 rounded" />
    </div>
    <span class="w-10 lg:flex hidden text-center">
      <skeleton class="w-22 h-1.5 rounded" />
    </span>
    <div class="w-1/4 ml-auto mr-1 justify-end flex">
      <skeleton class="w-20 h-1.5 rounded" />
    </div>
  </div>
</template>
