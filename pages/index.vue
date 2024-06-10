<!-- #005ba0 rgb(0,91,160) DarkBlue -->
<!-- #01c5ee rgb(1, 197, 238) LightBlue -->
<!-- #f0f2f5 rgb(240, 242, 245) OffWhite -->

<template>
  <div class="home">
    <section id="search-section" class="search-section">
      <WebSectionsSearch />
      <!-- <NuxtLink to="/contractor/editContractors" class="edit-button-link">
        <button class="edit-button">Edit Contractors</button>
      </NuxtLink> -->
    </section>

    <section class="services-section boil-bot-white">
      <!-- prettier-ignore -->
    </section>

    <section>
      <!-- prettier-ignore -->
    </section>
  </div>
</template>


<script setup>
import { onMounted, onUnmounted } from "vue";

await preloadComponents("WebSectionsIntroWithVid");

useSeoMeta({
  title: "Performance Marketing Agency || HARTECHO",
  ogTitle: "Performance Marketing Agency || HARTECHO",
  description:
    "Welcome to our performance marketing agency. We specialize in Google Ads, Facebook Ads, premium websites, SEO, branding, and tech support. Partner with us to resonate with your target audience and drive growth for your brand.",
  ogDescription:
    "Welcome to our performance marketing agency. We specialize in Google Ads, Facebook Ads, premium websites, SEO, branding, and tech support. Partner with us to resonate with your target audience and drive growth for your brand.",
  ogImage: "/SSLogo.png",
  twitterCard: "/SSLogo.png",
});

onMounted(() => {
  const searchSection = document.getElementById("search-section");

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const offset = scrollPosition * 0.5; // Adjust this multiplier to change the effect
    searchSection.style.backgroundPosition = `center ${offset}px`;
  };

  window.addEventListener("scroll", handleScroll);

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>


<style scoped media="screen">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

.search-section {
  /* margin-top: -10rem; */
  position: relative;
  height: 45rem;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
}
</style>

