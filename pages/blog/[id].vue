<template>
  <div>
    <div class="img-wrapper" v-if="post">
      <NuxtImg :src="post.image" alt="Blog Image" />
    </div>
    <div class="blog-content-wrapper">
      <div class="blog-post" v-if="post">
        <h1>{{ post.mainTitle }}</h1>
        <p class="header">{{ post.header }}</p>
        <p>{{ post.intro }}</p>
        <div
          v-for="(section, index) in post.sections"
          :key="'section-' + index"
        >
          <div v-if="section.photo" class="section-img-wrapper">
            <NuxtImg
              v-if="section.photo"
              :src="section.photo"
              alt="Section Photo"
            />
          </div>
          <h2>{{ section.title }}</h2>
          <p>{{ section.content }}</p>
          <div
            v-for="(list, listIndex) in section.lists"
            :key="'list-' + listIndex"
            class="list-section"
          >
            <h3>{{ list.header }}</h3>
            <ul>
              <li
                v-for="(item, itemIndex) in list.items"
                :key="'item-' + itemIndex"
              >
                <strong>{{ item.title }}</strong>
                <p>{{ item.description }}</p>
              </li>
            </ul>
          </div>
        </div>
        <h2 v-if="post.references[0]">References</h2>
        <div v-for="(reference, index) in post.references" :key="index">
          <p class="references">{{ reference }}</p>
        </div>
      </div>

      <div class="sidebar">
        <h2>Other Popular Posts</h2>
        <p>Coming Soon...</p>
        <div
          class="sidebar-post"
          v-for="(post, index) in otherPosts"
          :key="index"
        >
          <NuxtLink :to="`/blog/${post._id}`">
            <img :src="resolvedImgPath(post.thumbnail)" alt="Post Thumbnail" />
            <h3>{{ post.mainTitle }}</h3>
            <p>{{ post.preview }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="related-links-wrapper">
      <div class="related-links" v-if="relatedLinks.length">
        <h2>Related Blog Websites</h2>
        <ul>
          <li v-for="(link, index) in relatedLinks" :key="index">
            <a :href="link.url" target="_blank">{{ link.title }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: post } = await useFetch(`/api/blogs?_id=${useRoute().params.id}`);
// const { data: otherPosts } = await useFetch("/api/popular-blogs"); // Fetch other popular or relevant posts

useSeoMeta({
  title: post.value.mainTitle,
  ogTitle: post.value.mainTitle,
  description: post.value.preview,
  ogDescription: post.value.preview,
  ogImage: post.value.thumbnail,
  twitterCard: post.value.thumbnail,
});

const relatedLinks = ref([
  {
    title: "Commercial Construction Trends",
    url: "https://www.constructiondive.com/topic/commercial/",
  },
  {
    title: "Modern Techniques in Commercial Construction",
    url: "https://www.forconstructionpros.com/",
  },
  {
    title: "Sustainable Building Materials",
    url: "https://www.buildinggreen.com/",
  },
  { title: "Latest News in Construction", url: "https://www.enr.com/" },
  {
    title: "Commercial Construction Contracts",
    url: "https://www.constructionexec.com/",
  },
]);

const resolvedImgPath = (path) => {
  if (path) {
    return "/" + path;
  }
  return "/SSLogo.webp";
};

const lastScrollTop = ref(0);

const handleScroll = () => {
  const sidebar = document.querySelector(".sidebar");
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop.value) {
    sidebar.classList.remove("large");
    sidebar.classList.add("small");
  } else {
    sidebar.classList.remove("small");
    sidebar.classList.add("large");
  }

  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
</script>


<style scoped>
.img-wrapper {
  width: 100%;
  height: 25rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 2rem;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-content-wrapper {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.blog-post {
  flex: 1;
  margin-right: 2rem;
  padding: 4rem 2rem;
  font-family: "Merriweather", serif;
  color: #444;
  line-height: 1.8;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.blog-post h1 {
  font-size: 2.5rem;
  line-height: 2.7rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #333;
}

.blog-post h2 {
  font-size: 2rem;
  line-height: 2.2rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.header {
  font-size: 1.4rem;
  font-style: italic;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #666;
}

.blog-post p {
  font-size: 1.2rem;
  margin-bottom: 1.2em;
}

p {
  color: black;
}

.section-img-wrapper {
  width: 100%;
  height: auto;
  margin-bottom: 1.5em;
}

.section-img-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.list-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.list-section h3 {
  font-size: 1.5rem;
  font-family: "Playfair Display", serif;
  color: #333;
  margin-bottom: 0.5rem;
}

.list-section ul {
  padding-left: 1.5rem;
}

.list-section ul li {
  margin-bottom: 0.75rem;
}

.list-section ul li strong {
  font-size: 1.2rem;
  font-family: "Merriweather", serif;
  color: #444;
}

.references {
  font-size: 1.2rem;
  word-break: break-all;
}

.related-links-wrapper {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}

.related-links {
  padding: 2rem;
  font-family: "Merriweather", serif;
  color: #444;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.related-links h2 {
  font-size: 2rem;
  line-height: 2.2rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #333;
}

.related-links ul {
  list-style-type: none;
  padding-left: 0;
}

.related-links ul li {
  margin-bottom: 0.75rem;
}

.related-links ul li a {
  color: #005ba0;
  text-decoration: none;
}

.related-links ul li a:hover {
  text-decoration: underline;
}

.sidebar {
  flex: 0 0 300px;
  position: -webkit-sticky;
  position: sticky;
  height: fit-content;
  background: #f9f9f9;
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
  color: #333;
  margin-bottom: 1rem;
}

.sidebar-post {
  margin-bottom: 1.5rem;
}

.sidebar-post img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.sidebar-post h3 {
  font-size: 1.2rem;
  font-family: "Merriweather", serif;
  color: #444;
  margin-bottom: 0.5rem;
}

.sidebar-post p {
  font-size: 1rem;
  font-family: "Merriweather", serif;
  color: #666;
}

.divider {
  min-height: 7rem;
  background-color: #e0f7fa;
}

@media (max-width: 768px) {
  .blog-content-wrapper {
    flex-direction: column;
  }

  .blog-post {
    margin-right: 0;
  }

  .sidebar {
    position: relative;
    top: 0;
    margin-top: 2rem;
  }

  .sidebar.large {
    top: 0rem;
  }

  .sidebar.small {
    top: 0rem;
  }
}

@media (max-width: 480px) {
  .blog-content-wrapper {
    padding: 0rem;
  }

  .related-links-wrapper {
    padding: 0;
  }

  .related-links {
    background: white;
    box-shadow: none;
  }

  .sidebar {
    box-shadow: none;
    background: white;
    height: auto;
    min-height: 0;
  }

  .blog-post {
    padding: 2rem 1rem;
    box-shadow: none;
  }
}
</style>

