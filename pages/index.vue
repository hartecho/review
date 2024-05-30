<!-- #005ba0 rgb(0,91,160) DarkBlue -->
<!-- #01c5ee rgb(1, 197, 238) LightBlue -->
<!-- #f0f2f5 rgb(240, 242, 245) OffWhite -->

<template>
  <div class="home">
    <section class="intro-section wave-bottom-blue"></section>

    <section></section>

    <section class="services-section boil-bot-white">
      <!-- prettier-ignore -->
    </section>

    <section>
      <!-- prettier-ignore -->
    </section>
  </div>
</template>

<script setup>
await preloadComponents("WebSectionsIntroWithVid");

useSeoMeta({
  title: "Performance Marketing Agency || HARTECHO",
  ogTitle: "Performance Marketing Agency || HARTECHO",
  description:
    "Welcome to our performance marketing agency. We specialize in Google Ads, Facebook Ads, premium websites, SEO, branding, and tech support. Partner with us to resonate with your target audience and drive growth for your brand.",
  ogDescription:
    "Welcome to our performance marketing agency. We specialize in Google Ads, Facebook Ads, premium websites, SEO, branding, and tech support. Partner with us to resonate with your target audience and drive growth for your brand.",
  ogImage: "/HARTECHOLogo.webp",
  twitterCard: "/HARTECHOLogo.webp",
});
</script>

<style scoped media="screen">
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
