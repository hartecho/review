<template>
  <!-- prettier-ignore -->
  <div class="mobile-nav-buttons">
    <div class="link" v-for="(link, index) in navPaths" :key="index">
        <NuxtLink :to="getRoute(link)" class="" @click.native="$emit('toggleMobileNav')">{{ link.charAt(0).toUpperCase() + link.slice(1) }}</NuxtLink>
    </div>
    <div class="ex">
        <img :src="resolvedExImgPath()" alt="x" @click="$emit('toggleMobileNav')"/>
    </div>
</div>
</template>

<script setup>
const props = defineProps({
  navPaths: Array,
  exImg: String,
});

function resolvedExImgPath() {
  return "/" + props.exImg;
}

function getRoute(link) {
  return link === "home" ? "/" : `/${link}`;
}
</script>

<style scoped>
.mobile-nav-buttons {
  display: none;
}

@media (max-width: 768px) {
  .mobile-nav-buttons {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    background: black;
    padding: 25px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    height: 100vh;
    width: 100%;
    box-shadow: 0 0 5px black;
    transition: transform 0.5s, opacity 0.5s;
    align-items: right;
  }

  a,
  .link {
    text-decoration: none;
    font-size: 40px;
    transition: color 0.5s;
    margin-bottom: 2rem;
  }

  a:hover,
  .link:hover {
    color: white;
  }

  /* Router link animations */
  a.router-link-exact-active {
    transition: color 0.6s;
    color: white;
  }

  .ex {
    height: 2rem;
    width: 2rem;
    position: absolute;
    object-fit: cover;
    right: 30px;
    top: 30px;
  }

  .ex img {
    height: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  a,
  .link {
    font-size: 2rem;
  }

  .ex {
    height: 1.5rem;
    width: 1.5rem;
  }
}
</style>
