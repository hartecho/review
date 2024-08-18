<template>
  <div>
    <NuxtLayout>
      <!-- Page content with transition -->
      <transition name="fade" mode="out-in">
        <div class="page-wrapper">
          <NuxtPage @hide-loading="hideLoadingScreen" />
        </div>
      </transition>

      <!-- Loading popup controlled by isLoading -->
      <div v-if="isLoading" class="loading-popup">
        <div class="loading-spinner"></div>
        <p>Loading, please wait...</p>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import { useRouter } from "vue-router";

const isLoading = ref(false);
const router = useRouter();

// Function to show the loading screen
function showLoadingScreen() {
  isLoading.value = true;
}

// Function to hide the loading screen, can be triggered from any page
function hideLoadingScreen() {
  isLoading.value = false;
}

// Provide the showLoadingScreen function so that child components (pages) can use it
provide("showLoadingScreen", showLoadingScreen);

// Handle route changes to initially show the loading screen
router.beforeEach((to, from, next) => {
  showLoadingScreen();
  next();
});
</script>

<style scoped>
/* Wrapper to ensure transition works correctly */
.page-wrapper {
  width: 100%;
  height: 100%;
}

/* Loading popup styling */
.loading-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 20;
  flex-direction: column;
  transition: opacity 0.5s ease;
  opacity: 1;
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid white;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Fade transition styling */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Additional global styles */
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
@import "./css/Dividers/RampBlack.css";
@import "./css/Dividers/WaveDividerBlue.css";
@import "./css/Dividers/WaveDividerWhite.css";
@import "./css/Dividers/GeoTopWhite.css";
@import "./css/Dividers/GeoBotWhite.css";
@import "./css/Dividers/BoilTopWhite.css";
@import "./css/Dividers/BoilBotWhite.css";
@import "./css/ButtonStyles/ResonateButton.css";
@import "./css/ButtonStyles/ResonateButtonDark.css";
@import "./css/ButtonStyles/BubbleButton.css";
@import "./css/ButtonStyles/QuoteButton.css";
@import "./css/ButtonStyles/ContactBannerButton.css";
@import "./css/Transitions/Fade.css";

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
