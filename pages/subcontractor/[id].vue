<template>
  <div class="profile-page">
    <section class="header-section">
      <ProfileHeaderSection
        :business="subcontractor"
        :tagDescriptions="tagDescriptions"
        :contactSubcontractor="contactSubcontractor"
        :roundedRating="roundedRating"
      />
    </section>
    <section class="tabs-section">
      <ProfileTabsSection
        :business="subcontractor"
        businessType="Subcontractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :existingReview="existingReview"
        :isPro="isPro"
      />
    </section>
    <section class="reviews-section">
      <ReviewReviewsSection
        :business="subcontractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :reviews="reviews"
        :isPro="isPro"
      />
    </section>
    <div :class="['modal-wrapper', { 'is-visible': showLoginModal }]">
      <NavFooterPreloadLoginModal @close="closeLoginModal" />
    </div>
  </div>
</template>
  
  <script setup>
import { tagDescriptions } from "~/utils/tagDescriptions.js";

const route = useRoute();
const store = useStore();
const existingReview = ref(null);
const isLoggedIn = computed(() => !!store.token);

const { data: subcontractor, pending: subcontractorPending } = await useFetch(
  `/api/subcontractors?_id=${route.params.id}`
);

const { data: reviews } = await useFetch(
  `/api/reviews?subcontractorId=${subcontractor.value._id}`
);

const siftReviews = (reviews) => {
  // console.log("reviews: ", reviews);
  if (isLoggedIn.value) {
    const userReview = reviews.find(
      (review) => review.reviewer._id === store.user._id
    );
    existingReview.value = userReview || null;
  }
};

onMounted(() => {
  if (reviews.value) {
    siftReviews(reviews.value);
  }
});

useSeoMeta({
  title: `${subcontractor.value?.company} Reviews | Subsource – Trusted Subcontractor Insights`,
  ogTitle: `${subcontractor.value?.company} Reviews | Subsource – Trusted Subcontractor Insights`,
  description: `Read detailed reviews and ratings for ${subcontractor.value?.company}. Discover why they are a trusted subcontractor in their field. Leave your own review and share your experience.`,
  ogDescription: `Read detailed reviews and ratings for ${subcontractor.value?.company}. Discover why they are a trusted subcontractor in their field. Leave your own review and share your experience.`,
  ogImage: `/${subcontractor.value?.picture}`,
  twitterCard: `/${subcontractor.value?.picture}`,
});

const showLoginModal = ref(false);
const activeTab = ref("reviews");

const contactSubcontractor = () => {
  alert(`Contacting ${subcontractor.value?.company}`);
};

const openLoginModal = () => {
  showLoginModal.value = true;
  document.body.classList.add("no-scroll");
};

const closeLoginModal = () => {
  showLoginModal.value = false;
  document.body.classList.remove("no-scroll");
};

const roundedRating = computed(() => {
  return Math.round(subcontractor.value?.ratings || 0);
});

const isBusinessOwner = computed(() => {
  // console.log("subcontractor.value._id: " + subcontractor.value._id);
  // console.log("store.user.businesses: " + store.user.businesses);
  // console.log(
  //   "store.user.businesses.includes(contractor.value._id): " +
  //     store.user.businesses.includes(subcontractor.value._id)
  // );
  if (!store.user || !subcontractor.value) {
    return false;
  }
  const isOwner = store.user.businesses.includes(subcontractor.value._id);
  return isOwner;
});

const isPro = computed(() => {
  // ISPRO
  return false;
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>
  
  
  <style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-section {
  width: 100%;
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  position: relative;
  padding: 8rem 4rem 0 4rem;
}

.header-section::before {
  content: "";
  position: absolute;
  top: 10rem;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.2),
    rgba(0, 0, 0, 0)
  );
  z-index: 0;
}

@media (max-width: 768px) {
  .header-section {
    padding: 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 0.5rem 1rem;
  }
}

.tabs-section {
  width: 100%;
  padding: 1rem 3rem;
}

@media (max-width: 768px) {
  .tabs-section {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .tabs-section {
    padding: 0.5rem 0.5rem;
  }
}

.reviews-section {
  width: 100%;
  margin-top: 20px;
  padding: 1rem 4rem;
}

@media (max-width: 768px) {
  .reviews-section {
    margin-top: 15px;
    padding: 1rem 2rem;
  }
}

@media (max-width: 480px) {
  .reviews-section {
    margin-top: 10px;
    padding: 0.5rem 1rem;
  }
}

.modal-wrapper {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.modal-wrapper.is-visible {
  visibility: visible;
  opacity: 1;
}
</style>
  
  