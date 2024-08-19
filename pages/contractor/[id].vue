<template>
  <div class="profile-page">
    <section class="header-section">
      <ProfileHeaderSection
        :business="contractor"
        :tagDescriptions="tagDescriptions"
        :contactContractor="contactContractor"
        :roundedRating="roundedRating"
      />
    </section>
    <section class="tabs-section">
      <ProfileTabsSection
        :business="contractor"
        businessType="Contractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :existingReview="existingReview"
        :isPro="isPro"
      />
    </section>
    <section class="reviews-section">
      <ReviewReviewsSection
        :business="contractor"
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
const isLoggedIn = computed(() => !!store.token);

const { data: contractor, pending: contractorPending } = await useFetch(
  `/api/contractors?_id=${route.params.id}`
);

const { data: reviews } = await useFetch(
  `/api/reviews?contractorId=${contractor.value._id}`
);

// console.log("Contractor: " + JSON.stringify(contractor.value));

const existingReview = computed(() => {
  if (isLoggedIn.value && reviews.value) {
    return (
      reviews.value.find((review) => review.reviewer._id === store.user._id) ||
      null
    );
  }
  return null;
});

useSeoMeta({
  title: `${contractor.value?.company} Reviews | Subsource – Trusted Contractor Insights`,
  ogTitle: `${contractor.value?.company} Reviews | Subsource – Trusted Contractor Insights`,
  description: `Read detailed reviews and ratings for ${contractor.value?.company}. Discover why they are a trusted contractor in their field. Leave your own review and share your experience.`,
  ogDescription: `Read detailed reviews and ratings for ${contractor.value?.company}. Discover why they are a trusted contractor in their field. Leave your own review and share your experience.`,
  ogImage: `/${contractor.value?.picture}`,
  twitterCard: `/${contractor.value?.picture}`,
});

const showLoginModal = ref(false);
const activeTab = ref("reviews");

const contactContractor = () => {
  alert(`Contacting ${contractor.value?.company}`);
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
  return Math.round(contractor.value?.ratings || 0);
});

const isBusinessOwner = computed(() => {
  // console.log("contractor.value._id: " + contractor.value._id);
  // console.log("store.user.businesses: " + store.user.businesses);
  // console.log(
  //   "store.user.businesses.includes(contractor.value._id): " +
  //     store.user.businesses.includes(contractor.value._id)
  // );
  if (!store.user || !contractor.value) {
    return false;
  }
  const isOwner = store.user.businesses.includes(contractor.value._id);
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

