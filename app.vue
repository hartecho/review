<template>
  <div>
    <NuxtLayout>
      <!-- Page content -->
      <div class="content">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
const store = useStore();
const isLoggedIn = computed(() => !!store.token);
</script>

<style scoped>
/* Ensure the wrapper takes up 100% of the viewport height */
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  /* overflow: hidden; */
}

/* Flex container to align sidebar and content side by side */
.flex-container {
  display: flex;
  height: 100%;
}

/* Content styling */
.content {
  flex-grow: 1;
  padding: 0px;
  /* background: #2e2e3e; */
  color: #fff;
  font-family: "Montserrat", sans-serif;
  /* border-top-left-radius: 15px; */
  /* border-bottom-left-radius: 15px; */
  overflow-y: auto;
}

/* Login container styling (if used elsewhere) */
.login-container {
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  max-width: 300px;
  margin: 200px auto;
  padding: 20px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.7);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

form button {
  width: 100%;
  height: 2rem;
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
}

body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

a:visited,
a:link,
a:focus,
a:active {
  outline: none;
  text-decoration: none;
  background: none;
  color: inherit;
  box-shadow: none;
  -webkit-tap-highlight-color: transparent; /* Removes tap highlight color in mobile browsers */
}
</style>

