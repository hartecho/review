<template>
  <nav class="nav-bar" ref="navbar">
    <!-- Top Section -->
    <div class="top-nav">
      <div class="top-nav-content">
        <div class="brand">
          <NuxtLink to="/" class="nav-logo-box">
            <img
              :src="resolvedLogoPath()"
              loading="eager"
              alt="Company Logo"
              class="nav-logo"
            />
          </NuxtLink>
          <div class="nav-name">
            <h1>{{ companyName }}</h1>
          </div>
        </div>
        <div class="login-info">
          <span v-if="isLoggedIn" class="logged-in-message"
            >Logged in as {{ userName }}</span
          >
          <button
            v-if="!isLoggedIn"
            @click="openLoginModal"
            class="login-button"
          >
            Sign In / Sign Up
          </button>
          <button v-else class="login-button" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <!-- Bottom Section -->
    <div class="bottom-nav">
      <div class="bottom-nav-content">
        <div class="links">
          <div class="link" v-for="(link, index) in navPaths" :key="index">
            <NuxtLink :to="getRoute(link)">{{
              link.charAt(0).toUpperCase() + link.slice(1)
            }}</NuxtLink>
            <span v-if="index < navPaths.length - 1">|</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile Section -->
    <!-- <div class="mobile-bars">
      <div class="brand">
        <NuxtLink to="/" class="nav-logo-box">
          <img
            :src="resolvedLogoPath()"
            loading="eager"
            alt="Company Logo"
            class="nav-logo"
          />
        </NuxtLink>
        <div class="nav-name">
          <h1>{{ companyName }}</h1>
        </div>
      </div>
      <div class="nav-img-wrapper" @click="$emit('toggleMobileNav')">
        <img :src="resolvedNavBarsPath()" loading="eager" alt="nav-bars" />
      </div>
    </div> -->
    <div :class="['modal-wrapper', { 'is-visible': showLoginModal }]">
      <NavFooterPreloadLoginModal @close="closeLoginModal" />
    </div>
  </nav>
</template>

<script setup>
const store = useStore();
const isLoggedIn = computed(() => !!store.token);
const userName = computed(() =>
  store.user && store.user.name ? store.user.name : ""
);
const showLoginModal = ref(false);
let navbar = ref(null);
let lastScrollPosition = ref(0);

const logout = () => {
  store.logout();
  window.location.reload();
  console.log("Logged out");
};

const props = defineProps({
  navPaths: {
    type: Array,
    validator: function (array) {
      return array.every((item) => typeof item === "string");
    },
    default: () => [],
  },
  companyName: String,
  logoPath: String,
  navBarsButtonPath: String,
});

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

function resolvedLogoPath() {
  return "/" + props.logoPath;
}

function resolvedNavBarsPath() {
  return "/" + props.navBarsButtonPath;
}

function getRoute(link) {
  if (link == "home") return "/";
  else if (link == "search Contractors") return "/searchContract";
  else if (link == "search Subcontractors") return "/searchSub";
  else return `/${link}`;
}

function handleScroll() {
  const currentScrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;
  if (currentScrollPosition < lastScrollPosition.value) {
    // Scrolling up
    navbar.value.classList.remove("nav-bar-hidden");
  } else {
    // Scrolling down
    navbar.value.classList.add("nav-bar-hidden");
  }
  lastScrollPosition.value = currentScrollPosition;
}

function openLoginModal() {
  showLoginModal.value = true;
  document.body.classList.add("no-scroll");
}

function closeLoginModal() {
  showLoginModal.value = false;
  document.body.classList.remove("no-scroll");
}
</script>

<style scoped>
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 7;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #c0c0c0;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue",
    Helvetica, Arial !important;
  transition: top 0.3s ease-in-out;
}

.nav-bar-hidden {
  top: -75px; /* Adjust this value based on the height of your navbar */
}

.top-nav {
  background-color: rgba(30, 30, 30, 0.9); /* Color for top section */
  width: 100%;
}

.top-nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px; /* Center the content */
  margin: 0 auto;
  padding: 0 1rem;
  height: 80px; /* Double the height of the bottom section */
}

.bottom-nav {
  background-color: rgba(22, 22, 23, 0.8); /* Color for bottom section */
  width: 100%;
}

.bottom-nav-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 1200px; /* Center the content */
  margin: 0 auto;
  padding: 0 1rem;
  height: 40px; /* Bottom section height */
}

.links {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
}

.nav-logo-box {
  width: 50px;
  height: 45px;
}

.nav-logo {
  height: auto;
  max-width: 100%;
}

.nav-name h1 {
  font-size: 25px;
  margin-left: 1rem;
}

.login-info {
  display: flex;
  align-items: center;
}

.logged-in-message {
  margin-right: 1rem;
  font-size: 16px;
}

.login-button {
  font-size: 18px;
  /* font-weight: bold; */
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #ff8210;
  color: white;
  text-shadow: 1px 1px 5px black;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  outline: none;
}

.login-button:hover {
  background-color: #faa94a;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login-button:active {
  background-color: #388e3c;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.link {
  text-decoration: none;
  font-size: 15px;
  transition: color 0.5s;
}

.link span {
  margin: 0 0.5rem;
}

a:hover,
.link:hover {
  color: white;
}

a.router-link-exact-active {
  color: white;
}

.mobile-bars {
  display: none;
}

.modal-wrapper {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background: rgba(0, 0, 0, 0.8); */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.modal-wrapper.is-visible {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-bar {
    height: auto;
  }
  .nav-buttons {
    display: none;
  }

  .brand {
    height: 100%;
  }

  .mobile-bars {
    display: flex;
    justify-content: flex-end;
    padding-right: 1rem;
  }
}

/* @media (max-width: 480px) {
  .link {
    font-size: 1.5rem;
  }

  h1 {
    font-size: 4vw;
    font-weight: bold;
  }
} */
</style>

<style>
.no-scroll {
  overflow: hidden;
  padding-right: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s;
}

.modal-enter,
.modal-leave-to /* .modal-leave-active in <2.1.8 */ {
  opacity: 0;
}

* {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Standard syntax */
}
</style>
