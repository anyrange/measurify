<template>
  <div class="flex flex-row items-center gap-x-2 flex-1">
    <h1 class="text-xl sm:text-2xl font-medium text-white truncate">
      <slot />
    </h1>
    <!-- <Link :to="href"> 
    
    </Link>
     -->
    <a :href="link" class="appearance-none" target="_blank" rel="no-referrer">
      <icon
        class="
          w-4.7
          h-4.7
          sm:w-6 sm:h-6
          text-white
          hover:text-green-500-spotify
          cursor-pointer
          duration-200
        "
        icon="fa6-brands:spotify"
      />
    </a>
  </div>

  <!-- <a
    href="https://open.spotify.com/user/qmqg3caywrap0z5d7zsyosnvz"
    class="appearance-none"
    target="_blank"
    rel="no-referrer"
    >
    </a> -->
</template>

<script setup>
defineProps({
  link: {
    type: String,
    required: true,
  },
});
</script>
