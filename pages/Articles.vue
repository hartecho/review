<template>
  <div class="blogs-wrapper">
    <section class="blogs-intro">
      <div class="blog-title">
        <h1>Articles</h1>
      </div>
    </section>

    <div class="filters">
      <select v-model="selectedTag" @change="filterBlogsByTag">
        <option value="">All Tags</option>
        <option v-for="tag in allTags" :key="tag" :value="tag">
          {{ tag }}
        </option>
      </select>

      <select v-model="sortOption" @change="sortBlogs">
        <option value="alphabetical">Alphabetical</option>
        <option value="reverse-alphabetical">Reverse Alphabetical</option>
        <option value="most-recent">Most Recent</option>
        <option value="oldest-first">Oldest First</option>
      </select>
    </div>

    <section class="blog-list">
      <div
        class="blog-entry"
        v-for="(blog, index) in paginatedBlogs"
        :key="blog._id"
      >
        <div class="blog-entry__thumbnail" @click="goToBlog(blog._id)">
          <NuxtImg
            :src="resolvedImgPath(blog.thumbnail)"
            :alt="blog.mainTitle + ' picture'"
            :placeholder="generatePlaceholderUrl(blog.thumbnail)"
            loading="lazy"
            @load="onImageLoad(index)"
            :class="{ 'image-loaded': loadedImages[index] }"
            @click="goToBlog(blog._id)"
          />
        </div>
        <div class="blog-entry__content">
          <h2 class="blog-entry__title">{{ blog.mainTitle }}</h2>
          <p class="blog-entry__excerpt">{{ blog.preview }}</p>
          <NuxtLink :to="`/blog/${blog._id}`" class="blog-entry__link"
            >Read More ></NuxtLink
          >
        </div>
      </div>

      <div class="pagination">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
      </div>

      <!-- <NuxtLink to="/blog/editBlogs" class="edit-button-link">
        <button class="edit-button">Edit Blogs</button>
      </NuxtLink> -->
    </section>
  </div>
</template>

<script setup>
// Fetch data during build
const { data: blogs } = await useAsyncData("blogs", () => $fetch("/api/blogs"));

const selectedTag = ref("");
const sortOption = ref("most-recent");
const loadedImages = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(5); // Set the number of items per page

const allTags = computed(() => {
  const tags = new Set();
  blogs.value.forEach((blog) => {
    blog.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
});

const filteredBlogs = computed(() => {
  let filtered = blogs.value;

  if (selectedTag.value) {
    filtered = filtered.filter((blog) => blog.tags.includes(selectedTag.value));
  }

  if (sortOption.value === "alphabetical") {
    filtered = filtered.sort((a, b) => a.mainTitle.localeCompare(b.mainTitle));
  } else if (sortOption.value === "reverse-alphabetical") {
    filtered = filtered.sort((a, b) => b.mainTitle.localeCompare(a.mainTitle));
  } else if (sortOption.value === "most-recent") {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.updated.date).getTime();
      const dateB = new Date(b.updated.date).getTime();
      return dateB - dateA;
    });
  } else if (sortOption.value === "oldest-first") {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.updated.date).getTime();
      const dateB = new Date(b.updated.date).getTime();
      return dateA - dateB;
    });
  }

  return filtered;
});

const paginatedBlogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBlogs.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredBlogs.value.length / itemsPerPage.value);
});

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

const goToBlog = (blogId) => {
  // useNuxtApp().$fbq("track", "ViewContent");
  useRouter().push(`/blog/${blogId}`);
};

// Function to handle image load event
const onImageLoad = (index) => {
  loadedImages.value = { ...loadedImages.value, [index]: true };
};

useSeoMeta({
  title: "Blog - #1 Utah-based Marketing Agency || HARTECHO",
  ogTitle: "Blog - #1 Utah-based Marketing Agency || HARTECHO",
  description:
    "Browse our blog for the latest digital marketing news, tips, and insights. Get unique, valuable information from our Utah-based marketing agency.",
  ogDescription:
    "Browse our blog for the latest digital marketing news, tips, and insights. Get unique, valuable information from our Utah-based marketing agency.",
  ogImage: "/HARTECHOLogo.webp",
  twitterCard: "/HARTECHOLogo.webp",
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.blogs-intro {
  height: 15rem;
  background: url("/IntroBG.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.blog-title {
  max-width: 1200px;
  width: 100%;
  padding: 2rem 0rem;
  text-align: left;
}

.blog-title h1 {
  font-size: 3rem;
  text-shadow: 1px 1px 2px black;
  color: white;
  padding-left: 1rem;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.filters select {
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.blog-list {
  padding: 6rem 2rem;
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
}

.blog-entry {
  display: flex;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  max-width: 60rem;
  min-height: 15rem;
  overflow: hidden;
}

.blog-entry__thumbnail {
  height: 15rem;
  min-height: 15rem;
  min-width: 20rem;
  width: 20rem;
  overflow: hidden;
  cursor: pointer;
}

.blog-entry__thumbnail img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.blog-entry__content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  height: auto;
}

.blog-entry__title {
  font-size: 1.5rem;
  color: #333;
}

.blog-entry__excerpt {
  color: #666;
}

.blog-entry__link {
  color: #005ba0;
  text-decoration: none;
  font-weight: bold;
}

.blog-entry__link:hover {
  text-decoration: underline;
}

.edit-button-link {
  display: flex;
  justify-content: center;
  width: 100%;
}

.edit-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.divider {
  min-height: 7rem;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination button.active {
  background-color: #0056b3;
}

.pagination button:hover:not(.active) {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .blog-list {
    padding: 3rem 0;
  }

  .blog-entry {
    flex-direction: column;
    height: auto;
    margin: 1rem;
    justify-content: center;
    align-items: flex-start;
  }

  .blog-entry__thumbnail {
    height: 15rem;
    min-height: 15rem;
    min-width: 20rem;
    width: 100%;
  }

  .blog-entry__thumbnail img {
    height: 100%;
    width: 100%;
  }

  .blog-entry__content {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .blogs-intro {
    height: 15rem;
  }

  .blog-post {
    padding: 3rem 1rem;
  }
}
</style>
