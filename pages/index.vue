<!-- #005ba0 rgb(0,91,160) DarkBlue -->
<!-- #01c5ee rgb(1, 197, 238) LightBlue -->
<!-- #f0f2f5 rgb(240, 242, 245) OffWhite -->

<template>
  <div class="home">
    <section id="search-section" class="search-section ramp-black">
      <WebSectionsSearch />
    </section>

    <section class="about">
      <!-- prettier-ignore -->
    </section>

    <section>
      <!-- prettier-ignore -->
    </section>
  </div>
</template>


<script setup>
import { onMounted, onUnmounted } from "vue";
const config = useRuntimeConfig();
const emit = defineEmits(["hide-loading"]);

await preloadComponents("WebSectionsIntroWithVid");

useSeoMeta({
  title: "Subsource: Trusted Commercial Contractor Reviews & Ratings",
  ogTitle: "Subsource: Trusted Commercial Contractor Reviews & Ratings",
  description:
    "Discover reliable commercial contractors with Subsource. Read trusted reviews and ratings to find the best contractors for your business needs.",
  ogDescription:
    "Discover reliable commercial contractors with Subsource. Read trusted reviews and ratings to find the best contractors for your business needs.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

onMounted(() => {
  emit("hide-loading");
  const searchSection = document.getElementById("search-section");

  // console.log("config.public.JWT: ", config.public.JWT_SECRET);
  // console.log("config.public.CLIENT: ", config.public.GOOGLE_CLIENT_ID);
  // console.log("config.public.SEC: ", config.public.GOOGLE_CLIENT_SECRET);

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

.about {
  /* height: 45rem;
  background: url("/aboutBG.webp") no-repeat center top;
  background-size: cover; */
}
</style>

