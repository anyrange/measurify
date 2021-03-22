<template>
  <div class="h-screen w-screen bg-gray-800-spotify flex items-center">
    <div
      class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-300"
    >
      <div class="max-w-md">
        <div class="text-5xl font-dark font-bold mb-2">404</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mb-4">
          Sorry we couldn't find this page.
        </p>
        <p class="mb-8">
          But dont worry, you can find plenty of other things on our homepage.
        </p>
        <router-link to="/" c>
          <button
            class="px-4 inline py-2 text-sm font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-green-600-spotify hover:bg-green-700-spotify"
          >
            Back to home
          </button>
        </router-link>
      </div>
      <div class="max-w-lg"></div>
    </div>
  </div>
</template>
