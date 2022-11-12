<template>
  <div class="h-screen">
    <div
      class="-mt-4 -mx-4 flex flex-col items-start gap-2 static duration-300 md:flex-row md:gap-4 sm:mx-0 sm:mt-4 sm:items-center sm:gap-0"
    >
      <skeleton
        class="w-full h-92 mb-0 flex flex-none md:w-48 md:h-48 md:rounded-lg sm:w-40 sm:h-40 sm:rounded-full sm:bg-local sm:bg-cover sm:mb-4"
      />
      <div class="default-border mb-4 w-full border-b sm:border-none md:mb-0">
        <div class="mx-4 mb-2 text-left sm:m-0 md:text-left sm:text-center">
          <div class="h-7 flex items-center">
            <skeleton class="h-4 w-36 rounded" />
          </div>
        </div>
      </div>
    </div>
    <container>
      <cards>
        <card-skeleton v-for="i in 4" :key="i" />
      </cards>
    </container>
  </div>
</template>
