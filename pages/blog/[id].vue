<template>
  <div>
    <!-- prettier-ignore -->
    <section class="blog-page-intro" v-if="post">
      <WebSectionsContentPageIntroLite :subheader="post.mainTitle" textColor="white" textShadow="1px 1px 2px black"/>
    </section>
    <!-- prettier-ignore -->
    <div class="img-wrapper" v-if="post">
      <NuxtImg :src="post.image" alt="Blog Image" />
    </div>
    <!-- prettier-ignore -->
    <div class="blog-post" v-if="post">
      <!-- <h1>{{ post.mainTitle }}</h1> -->
      <p class="header">{{ post.header }}</p>
      <p>{{ post.intro }}</p>
      <div v-for="(section, index) in post.sections" :key="'section-' + index">
        <h2>{{ section.title }}</h2>
        <p>{{ section.content }}</p>
        <ul v-if="section.list && section.list.length">
          <li v-for="(item, itemIndex) in section.list" :key="'reference-' + itemIndex">
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
          </li>
        </ul>
      </div>
      <h2 v-if="post.references[0]">References</h2>
      <div v-for="(reference, index) in post.references" :key="index">
        <p class="references">{{ reference }}</p>
      </div>
    </div>
    <section class="divider wave-bot-green"></section>
  </div>
</template>

<script setup>
const { data: post } = await useFetch(`/api/blogs?_id=${useRoute().params.id}`);

useSeoMeta({
  title: post.value.mainTitle,
  ogTitle: post.value.mainTitle,
  description: post.value.preview,
  ogDescription: post.value.preview,
  ogImage: post.value.thumbnail,
  twitterCard: post.value.thumbnail,
});
</script>

<style scoped>
.blog-page-intro {
  height: 25rem;
  background: url("/wood.webp") no-repeat;
  background-size: cover;
  padding: 2rem 2rem;
  color: white;
}

.img-wrapper {
  /* margin-top: 15rem; */
  width: 100%;
  height: 20rem;
  overflow: hidden;
  position: relative;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.blog-post {
  max-width: 1000px;
  margin: 0 auto;
  padding: 6rem 0;
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

.blog-post h1 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-family: baskerville-display-pt, serif;
  font-weight: bolder;
}

.blog-post h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-family: freight-text-pro, serif;
  font-weight: bolder;
}

.header {
  font-size: 1.4rem !important;
  font-style: italic;
  font-weight: bolder;
  margin-bottom: 2rem;
}

.blog-post p {
  font-size: 1.5rem;
  margin-bottom: 1em;
  white-space: pre-line;
}

.blog-post img {
  width: 100%;
  height: auto;
  margin-bottom: 1em;
}

.blog-post ul {
  padding-left: 1em;
}

.blog-post ul li {
  margin-bottom: 0.5em;
}

.blog-post div {
  margin-bottom: 2em;
}

.references {
  font-size: 1.3rem;
  word-break: break-all;
}

.divider {
  min-height: 7rem;
}

@media (max-width: 768px) {
  /*  ------------  MOBILE  ------------   */
  /* .blog-page-intro {
    height: 20rem;
  } */

  .blog-post {
    padding: 3rem 2rem;
  }
}

@media (max-width: 480px) {
  /* .blog-page-intro {
    height: 15rem;
  } */

  .blog-post {
    padding: 3rem 1rem;
  }
}
</style>