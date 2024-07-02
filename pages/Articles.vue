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
      <div class="blog-entry" v-for="blog in filteredBlogs" :key="blog._id">
        <div class="blog-entry__thumbnail" @click="goToBlog(blog._id)">
          <img :src="resolvedImgPath(blog.thumbnail)" alt="Blog Thumbnail" />
        </div>
        <div class="blog-entry__content">
          <h2 class="blog-entry__title">{{ blog.mainTitle }}</h2>
          <p class="blog-entry__excerpt">{{ blog.preview }}</p>
          <NuxtLink :to="`/blog/${blog._id}`" class="blog-entry__link"
            >Read More ></NuxtLink
          >
        </div>
      </div>
      <!-- <NuxtLink to="/blog/editBlogs" class="edit-button-link">
        <button class="edit-button">Edit Blogs</button>
      </NuxtLink> -->
    </section>
    <section class=""></section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: "Articles | Subsource – Insights on Commercial Contracting",
  ogTitle: "Articles | Subsource – Insights on Commercial Contracting",
  description:
    "Browse our articles for the latest news, tips, and insights on commercial contracting. Stay informed with Subsource.",
  ogDescription:
    "Browse our articles for the latest news, tips, and insights on commercial contracting. Stay informed with Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

const router = useRouter();
const { data: blogs } = await useFetch("/api/blogs");
const selectedTag = ref("");
const sortOption = ref("most-recent");

const allTags = computed(() => {
  const tags = new Set();
  blogs.value.forEach((blog) => {
    blog.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
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
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.updated[b.updated.length - 1].date) -
        new Date(a.updated[a.updated.length - 1].date)
    );
  } else if (sortOption.value === "oldest-first") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(a.updated[a.updated.length - 1].date) -
        new Date(b.updated[b.updated.length - 1].date)
    );
  }

  return filtered;
});

const resolvedImgPath = (path) => {
  if (path) {
    return "/" + path;
  }
  return "/SSLogo.webp";
};

const goToBlog = (blogId) => {
  router.push(`/blog/${blogId}`);
};
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

@media (max-width: 768px) {
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
