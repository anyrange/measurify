<template>
  <div class="mt-15 w-full flex flex-col gap-2">
    <div class="w-full flex flex-row items-center gap-2.5">
      <div class="h-20 w-20 flex flex-none sm:w-28 sm:h-28">
        <skeleton class="h-full w-full rounded-full" />
      </div>
      <div
        class="
          gap-1
          w-full
          flex flex-row flex-wrap
          sm:flex-col
          items-center
          sm:items-start
          justify-between
          sm:justify-start
        "
      >
        <div class="w-full flex flex-col gap-2">
          <skeleton class="h-3 w-36 rounded-full" />
          <skeleton class="h-1.75 w-24 rounded-full" />
        </div>
      </div>
    </div>
    <skeleton class="mb-4 mt-8 h-3 w-full rounded-full" />
  </div>
</template>
