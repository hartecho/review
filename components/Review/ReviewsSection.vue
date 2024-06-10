<template>
  <div class="reviews-page">
    <!-- Left Column for Overall Rating and Filters -->
    <div class="left-column">
      <div class="filters">
        <div class="star-rating-breakdown">
          <h2>Customer reviews</h2>
          <div class="average-rating">
            <span class="average-rating-score">{{ contractorRating }}</span>
            <span class="average-rating-text">out of 5</span>
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star">
                {{ n <= contractorRating ? "★" : "☆" }}
              </span>
            </div>
          </div>
          <div class="rating-bars">
            <div
              class="rating-bar"
              v-for="n in [5, 4, 3, 2, 1]"
              :key="n"
              @click="filterByRating(n)"
            >
              <span>{{ n }} star</span>
              <div class="bar-container">
                <div
                  class="bar"
                  :style="{ width: ratingPercentages[n - 1] + '%' }"
                ></div>
              </div>
              <span>{{ ratingCounts[n - 1] }}</span>
            </div>
          </div>
        </div>
        <div class="tag-filters">
          <h3>Filter by Job Types</h3>
          <div class="tag" v-for="tag in availableTags" :key="tag">
            <input
              type="checkbox"
              :id="tag"
              :value="tag"
              v-model="selectedTags"
              @change="filterByTags"
            />
            <label :for="tag">{{ tagDescriptions[tag] }}</label>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Section for Reviews -->
    <div class="reviews-container">
      <ReviewReviews
        v-for="review in filteredReviews"
        :key="review._id"
        :review="review"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :isPro="isPro"
        :contractor="contractor"
        :fetchReviews="fetchReviews"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  contractor: {
    type: Object,
    required: true,
  },
  tagDescriptions: {
    type: Object,
    required: true,
  },
  isBusinessOwner: {
    type: Boolean,
    required: true,
  },
  isPro: {
    type: Boolean,
    required: true,
  },
});

const reviews = ref([]);
const filteredReviews = ref([]);
const selectedRating = ref(null);
const selectedTags = ref([]);
const ratingCounts = ref([0, 0, 0, 0, 0]);
const availableTags = ref([]);
const showUpdates = ref({});
const newReply = ref({});
const loading = ref(false);
const error = ref("");

// Fetch reviews
async function fetchReviews() {
  try {
    const response = await $fetch(
      `/api/reviews?contractor=${props.contractor._id}`
    );
    reviews.value = response;
    updateRatingCounts();
    filterReviews();
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
}

function updateRatingCounts() {
  ratingCounts.value = [0, 0, 0, 0, 0];
  reviews.value.forEach((review) => {
    const latestRating = review.updates.length
      ? review.updates[review.updates.length - 1].rating
      : review.rating;
    ratingCounts.value[latestRating - 1]++;
  });
}

const contractorRating = computed(() => {
  return props.contractor.ratings;
});

const ratingPercentages = computed(() => {
  const total = reviews.value.length;
  return ratingCounts.value.map((count) => ((count / total) * 100).toFixed(2));
});

function filterReviews() {
  filteredReviews.value = reviews.value.filter((review) => {
    const latestRating = review.updates.length
      ? review.updates[review.updates.length - 1].rating
      : review.rating;
    const ratingMatch = selectedRating.value
      ? latestRating === selectedRating.value
      : true;
    const tagsMatch = selectedTags.value.length
      ? selectedTags.value.every((tag) => review.tags.includes(tag))
      : true;
    return ratingMatch && tagsMatch;
  });
}

function filterByRating(rating) {
  selectedRating.value = rating;
  filterReviews();
}

function filterByTags() {
  filterReviews();
}

onMounted(() => {
  fetchReviews();
  if (props.contractor) {
    availableTags.value = props.contractor.tags;
  }
});
</script>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.reviews-page {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4rem;
  gap: 5rem;
  overflow: visible; /* Ensure no overflow hidden or auto */
}

.left-column {
  width: 30%;
  background: #f9f9f9;
  position: -webkit-sticky;
  position: sticky;
  top: 9rem;
  height: fit-content;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: flex-start; /* Ensure it doesn't stretch in a flex container */
}

.filters {
  color: black;
  padding: 20px;
}

.star-rating-breakdown h2,
.tag-filters h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.average-rating {
  display: flex;
  align-items: baseline;
  gap: 5px;
  font-size: 24px;
  font-weight: bold;
}

.average-rating-score {
  color: #ff9900;
}

.rating-bars {
  margin-top: 10px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.rating-bar:hover .bar {
  background: #ffb347;
}

.bar-container {
  flex: 1;
  background: #ddd;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.bar {
  height: 100%;
  background: #ff9900;
}

.tag-filters .tag {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding: 5px 10px;
  background: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
}

.tag-filters .tag:hover {
  background: #e0e0e0;
}

.tag-filters input[type="checkbox"] {
  margin-right: 10px;
}

.stars {
  display: flex;
  align-items: center;
}

.star {
  color: #ff9900;
  font-size: 30px; /* Increased font size for larger stars */
}

.reviews-container {
  width: 70%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
