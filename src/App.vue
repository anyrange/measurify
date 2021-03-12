<template>
  <div class="flex flex-wrap bg-gray-100 w-full h-screen">
    <div class="w-2/12 bg-white rounded p-3 shadow-lg">
      <Navbar />
    </div>
    <div class="w-10/12">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
a.router-link-exact-active {
  color: #42b983;
}
</style>
