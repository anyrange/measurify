<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
};
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

#app {
  font-family: "Inter", sans-serif;
}

a.router-link-exact-active {
  background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
}
</style>
