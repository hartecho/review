<template>
  <div>
    <nav>
      <NavFooterPreloadSleekNav
        :navPaths="currentPaths"
        @toggleMobileNav="showMobileNav = !showMobileNav"
        companyName="HARTECHO"
        logoPath="HARTECHOLogo.webp"
        navBarsButtonPath="NavBars.svg"
      />

      <NavFooterPreloadBlackBGMobileNav
        :navPaths="currentPaths"
        @toggleMobileNav="showMobileNav = !showMobileNav"
        exImg="X.svg"
        v-bind:class="{ 'nav-slide-out': !showMobileNav }"
      />
    </nav>
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

let paths = ["home", "login", "register", "settings", "blog", "contact"];
// Define the two arrays
const paths1 = ["home", "articles", "contact", "login"];
const paths2 = ["home", "profile", "articles", "contact", "logout"];

// Reactive variable to control which array is active
const usePaths1 = ref(true);

// Computed property to return the current array based on the reactive variable
const currentPaths = computed(() => {
  return usePaths1.value ? paths1 : paths2;
});
</script>