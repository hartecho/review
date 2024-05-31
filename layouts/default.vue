<template>
  <div>
    <NavFooterPreloadSleekNav
      :navPaths="currentPaths"
      @toggleMobileNav="showMobileNav = !showMobileNav"
      companyName="SUBSOURCE"
      logoPath="HARTECHOLogo.webp"
      navBarsButtonPath="NavBars.svg"
    />

    <NavFooterPreloadBlackBGMobileNav
      :navPaths="currentPaths"
      @toggleMobileNav="showMobileNav = !showMobileNav"
      exImg="X.svg"
      v-bind:class="{ 'nav-slide-out': !showMobileNav }"
    />
    <div>
      <slot />
    </div>
    <footer>
      <NavFooterPreloadBlackBubbleFooter
        :navPaths="currentPaths"
        companyName="HARTECHO"
        companyDescription="Performance Marketing Agency"
        phone="+1 (801) 793-5456"
        email="sales@hartecho.com"
      />
    </footer>
  </div>
</template>

<script setup>
const showMobileNav = ref(false);

const store = useStore();
const isLoggedIn = computed(() => !!store.token);

let paths = ["home", "login", "register", "settings", "blog", "contact"];
// Define the two arrays
const paths1 = [
  "home",
  "search Contractors",
  "search Subcontractors",
  "articles",
  "contact",
];
const paths2 = [
  "home",
  "profile",
  "search Contractors",
  "search Subcontractors",
  "articles",
  "contact",
];

// Reactive variable to control which array is active
const usePaths1 = ref(true);

// Computed property to return the current array based on the reactive variable
const currentPaths = computed(() => {
  return !!store.token ? paths2 : paths1;
});
</script>

<style scoped media="screen">
#app {
  scroll-behavior: smooth;
  background-color: #f0f2f5;
  font-family: "Montserrat", sans-serif;
  position: static;
}

.content {
  width: 100%;
  height: auto;
  animation: item-load 0.8s;
}

footer {
  position: relative;
  background-color: #101118;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  min-height: 40rem;
  overflow: hidden;
}

.image-overflow-hidden {
  overflow: hidden;
  width: 100%;
  height: 25vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}

.image-overflow-hidden img {
  width: 100%;
}

.divider-grow {
  transform: scale(100%);
  transition: 3s ease-out;
  max-width: 100%;
}

.divider-grow.active {
  transform: scale(140%);
}

@keyframes item-load {
  0% {
    transform: translateY(8%);
    opacity: 0%;
  }

  50% {
    transform: translateY(8%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}

@keyframes page-load {
  0% {
    transform: translateY(-20%);
    opacity: 0%;
  }

  100% {
    transform: translateY(0%);
    opacity: 100%;
  }
}

@media (max-width: 768px) {
  /* Mobile View */
  body.overflow-hidden {
    overflow: hidden;
  }

  .image-overflow-hidden {
    height: 32vh;
  }

  .nav-slide-out {
    transform: translateY(10%);
    opacity: 0;
    z-index: -1;
  }

  .divider-grow {
    transform: scale(100%);
    transition: 3s all ease-out;
    max-width: 100%;
  }

  .divider-grow.active {
    transform: scale(140%);
  }
}

@media (max-width: 480px) {
  .image-overflow-hidden {
    height: 25vh;
  }
}
</style>

<style>
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

*,
body {
  margin: 0;
  padding: 0;
  font-family: "Montserrat", sans-serif, "HelveticaNeue-Light",
    "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande",
    sans-serif;
  position: static;
  box-sizing: border-box;
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

p {
  line-height: 1.5;
}
</style>
