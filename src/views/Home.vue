<template>
  <div class="home">
    Home page
    <button @click="login">Login</button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    login() {
      window.location.href = "http://localhost:8888/login";
    },
  },
};
</script>
