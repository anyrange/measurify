<template>
  <ul class="space-y-2 text-sm">
    <li>
      <router-link
        class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
        to="/"
      >
        <span class="font-bold">Home</span>
      </router-link>
    </li>
    <li>
      <router-link
        class="flex items-center space-x-3 text-gray-700 p-2 rounded-md font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
        to="/about"
      >
        <span class="font-bold">About</span>
      </router-link>
    </li>
  </ul>
</template>
