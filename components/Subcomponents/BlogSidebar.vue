<template>
  <div class="sidebar" :class="{ large: isLarge, small: !isLarge }">
    <h2>Popular Posts</h2>
    <div class="sidebar-post" v-for="(post, index) in otherPosts" :key="index">
      <NuxtLink :to="`/blog/${post._id}`">
        <div class="img-wrapper">
          <NuxtImg
            :src="resolvedImgPath(post.image)"
            :alt="post.mainTitle + ' picture'"
            :placeholder="generatePlaceholderUrl(post.image)"
            loading="lazy"
            @load="onImageLoad(index)"
            :class="{ 'image-loaded': loadedImages[index] }"
          />
        </div>
        <h3>{{ post.mainTitle }}</h3>
        <p>{{ truncatePreview(post.preview) }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
  
  <script setup>
// Fetch data during build
const { data: otherPosts } = await useAsyncData("popularPosts", () =>
  $fetch("/api/blogs/popular")
);

const truncatePreview = (text) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences[0] : text;
};

const generatePlaceholderUrl = (url) => {
  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return url; // If no extension found, return original URL

  const extension = url.slice(lastDotIndex);
  const baseUrl = url.slice(0, lastDotIndex);
  return resolvedImgPath(`${baseUrl}Blur${extension}`);
};

const resolvedImgPath = (path) => {
  if (path) {
    return "/BlogPics/" + path;
  }
  return "/HARTECHOLogo.webp";
};

const lastScrollTop = ref(0);
const isLarge = ref(true);
const loadedImages = ref({});

const handleScroll = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop.value) {
    isLarge.value = false;
  } else {
    isLarge.value = true;
  }

  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
};

const onImageLoad = (index) => {
  loadedImages.value = { ...loadedImages.value, [index]: true };
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>
  
  <style scoped>
.sidebar {
  flex: 1;
  position: -webkit-sticky;
  position: sticky;
  height: fit-content;
  background: #ddd;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: top 0.4s;
}

.sidebar.large {
  top: 9rem;
}

.sidebar.small {
  top: 4rem;
}

.sidebar h2 {
  font-size: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: black;
  margin-bottom: 1rem;
}

.sidebar-post {
  margin-bottom: 1.5rem;
}

.img-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2);
  transition: transform 0.5s ease-in-out;
}

.img-wrapper img.image-loaded {
  transform: scale(1);
}

.sidebar-post h3 {
  font-size: 1.2rem;
  font-family: "Merriweather", serif;
  color: black;
  margin-bottom: 0.5rem;
}

.sidebar-post p {
  font-size: 1rem;
  font-family: "Merriweather", serif;
  color: #444;
}

@media (max-width: 768px) {
  .sidebar {
    margin-top: 2rem;
  }
}
</style>
  