<template>
  <div>
    <div class="img-wrapper" v-if="post">
      <NuxtImg
        :src="resolvedImgPath(post.image)"
        :alt="post.mainTitle + ' picture'"
        :placeholder="generatePlaceholderUrl(post.image)"
        loading="eager"
        @load="onImageLoad"
        :class="{ 'image-loaded': imageLoaded }"
      />
    </div>
    <div class="blog-content-wrapper">
      <div class="blog-post" v-if="post">
        <h1>{{ post.mainTitle }}</h1>
        <div class="post-header" v-if="post.author && post.date">
          <p class="header">
            Authored by {{ post.author }}, {{ formattedDate(post.date) }}
          </p>
          <div class="views">
            <img src="/ViewCountEye.svg" alt="Views Icon" class="views-icon" />
            <span>{{ formattedViews }}</span>
          </div>
        </div>
        <div v-if="post.updated && post.updated.date && post.updated.text">
          <p>
            <strong>Updated {{ formattedDate(post.updated.date) }}:</strong>
            {{ post.updated.text }}
          </p>
        </div>
        <p>{{ post.intro }}</p>
        <div
          v-for="(section, index) in post.sections"
          :key="'section-' + index"
        >
          <div v-if="section.photo" class="section-img-wrapper">
            <NuxtImg
              v-if="section.photo"
              :src="section.photo"
              :alt="section.title + ' Section Photo'"
              loading="lazy"
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
        <h2 v-if="post.references.length">References</h2>
        <div v-for="(reference, index) in post.references" :key="index">
          <p class="references">
            {{ reference }}
          </p>
        </div>
      </div>

      <SubcomponentsBlogSidebar />
    </div>

    <div class="related-links-wrapper">
      <div class="related-links" v-if="relatedLinks.length">
        <h2>Related External Blogs</h2>
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
// Fetch data during build
const route = useRoute();
const { data: post } = await useAsyncData(() =>
  $fetch(`/api/blogs?_id=${route.params.id}`)
);

// Function to format numbers with commas
const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Computed property to format the view count
const formattedViews = computed(() => {
  return post.value ? formatNumberWithCommas(post.value.views) : "0";
});

// Function to format the date
const formattedDate = (date) => {
  return new Date(date).toLocaleDateString();
};

// Function to extract the first sentence
const getFirstSentence = (text) => {
  const firstSentenceMatch = text.match(/(.*?[.?!])\s/);
  return firstSentenceMatch ? firstSentenceMatch[1] : text;
};

// Structured data
const structuredData = computed(() => {
  if (!post.value || !window) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.value.mainTitle,
    image: post.value.image,
    author: {
      "@type": "Person",
      name: post.value.author || "HARTECHO Digital Marketing",
    },
    publisher: {
      "@type": "Organization",
      name: "HARTECHO Digital Marketing",
      logo: {
        "@type": "ImageObject",
        url: "https://www.hartecho.com/HARTECHOLogo.webp",
      },
    },
    datePublished: new Date(post.value.date).toISOString(),
    dateModified: new Date(
      post.value.updated?.date || post.value.date
    ).toISOString(),
    description: post.value.preview,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": window.location.href,
    },
  };
});

const description = computed(() => {
  return post.value
    ? getFirstSentence(post.value.preview) +
        " HARTECHO || #1 Utah-based Marketing Agency"
    : "HARTECHO || #1 Utah-based Marketing Agency";
});

// SEO meta tags setup
onMounted(() => {
  incrementViews();
});

// Set structured data using useHead
useHead({
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify(structuredData.value),
    },
  ],
});

// Set SEO meta tags using useSeoMeta
useSeoMeta({
  title: post.value.mainTitle,
  ogTitle: post.value.mainTitle,
  description: description.value,
  ogDescription: description.value,
  ogImage: post.value ? post.value.thumbnail : "",
  twitterCard: post.value ? post.value.thumbnail : "",
});

const incrementViews = async () => {
  if (post.value) {
    post.value.views += 1;
    await $fetch(`/api/blogs/${post.value._id}`, {
      method: "PUT",
      body: JSON.stringify(post.value),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
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

// State to track image loading status
const imageLoaded = ref(false);

// Function to handle image load event
const onImageLoad = () => {
  imageLoaded.value = true;
};

const relatedLinks = ref([
  {
    title: "2024 Commercial Construction Trends - Scott + Reid",
    url: "https://www.scottandreid.com/news/2024-commercial-construction-trends",
  },
  {
    title:
      "Unveiling the Future: 2024 Commercial Construction Trends - Joseph Schmitt Construction",
    url: "https://www.jschmitt.cc/blog/unveiling-the-future-2024-commercial-construction-trends",
  },
  {
    title:
      "Emerging Trends in Commercial Construction for 2024 - Clark Pacific",
    url: "https://www.clarkpacific.com/news/emerging-trends-in-commercial-construction-for-2024",
  },
  {
    title: "2024 Construction Industry Economic Outlook",
    url: "https://www.bdcnetwork.com/2024-construction-industry-economic-outlook",
  },
  {
    title: "The Future of Construction: 10 Trends for 2024",
    url: "https://www.theb1m.com/article/the-future-of-construction-10-trends-for-2024",
  },
]);
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
  transform: scale(1.2);
  transition: transform 0.5s ease-in-out;
}

.img-wrapper img.image-loaded {
  transform: scale(1);
}

.blog-content-wrapper {
  display: flex;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
}

.blog-post {
  flex: 3;
  margin-right: 2rem;
  padding: 4rem 2rem;
  font-family: "Merriweather", serif;
  color: black;
  line-height: 1.8;
  background: #f2f2f2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.views-icon {
  width: 1.5rem;
  height: 1.5rem;
}

.blog-post h1 {
  font-size: 2.5rem;
  line-height: 2.7rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: black;
}

.blog-post h2 {
  font-size: 2rem;
  line-height: 2.2rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #555;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.header {
  font-size: 1.4rem;
  font-style: italic;
  font-weight: bold;
  margin-bottom: 2rem;
  color: black;
}

.blog-post p {
  font-size: 1.2rem;
  margin-bottom: 1.2em;
  color: #555;
}

p {
  color: #666;
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
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.list-section h3 {
  font-size: 1.5rem;
  font-family: "Playfair Display", serif;
  color: black;
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
  color: black;
}

.references {
  font-size: 1.2rem;
  word-break: break-all;
  color: black;
}

.related-links-wrapper {
  max-width: 1300px;
  margin: 2rem auto;
  padding: 2rem;
}

.related-links {
  padding: 2rem;
  font-family: "Merriweather", serif;
  color: black;
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
  color: black;
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

  .blog-post {
    padding: 2rem 1rem;
    box-shadow: none;
  }
}
</style>
