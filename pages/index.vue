<template>
  <div class="home">
    <section id="search-section" class="search-section ramp-black">
      <WebSectionsSearch />
    </section>

    <section class="about">
      <!-- prettier-ignore -->
      <WebSectionsAbout/>
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

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: auto;
}

.search-section {
  position: relative;
  height: 50rem;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  z-index: 1;
  margin-top: -20px; /* Adjust this to the height of your navbar */
  padding-top: 20px; /* Adjust this to maintain the original padding */
}

.about {
  background: black;
  width: 100%;
}
</style>
