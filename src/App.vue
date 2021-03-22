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

@media (prefers-color-scheme: dark) {
  .sidebar-spotify::-webkit-scrollbar {
    width: 8px;
    background-color: #121212;
  }
  .sidebar-spotify::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #535353;
  }
  .content-spotify::-webkit-scrollbar {
    width: 8px;
    background-color: #181818;
  }
  .content-spotify::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #535353;
  }
}

a.router-link-exact-active {
  color: #1db954;
}
.sidebar-spotify::-webkit-scrollbar {
  width: 8px;
  background-color: #e4e8ed;
}
.sidebar-spotify::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #c7cdd4;
}
.content-spotify::-webkit-scrollbar {
  width: 8px;
  background-color: #e4e8ed;
}
.content-spotify::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: #c7cdd4;
}
</style>
