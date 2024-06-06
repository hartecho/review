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
      <div class="advertisement"></div>
    </div>

    <!-- Main Section for Reviews -->
    <div class="reviews-container">
      <div v-for="review in filteredReviews" :key="review._id" class="review">
        <div class="review-header">
          <h4 class="reviewer-name">{{ review.reviewer.name }}</h4>
          <div class="rating">
            <span v-for="n in 5" :key="n" class="star">
              {{ n <= review.rating ? "★" : "☆" }}
            </span>
          </div>
        </div>
        <p class="review-date">
          {{ new Date(review.date).toLocaleDateString() }}
        </p>
        <p class="review-comment">{{ review.comment }}</p>
        <p class="review-tags">
          <strong>Tags:</strong>
          {{ review.tags.map((tag) => tagDescriptions[tag]).join(", ") }}
        </p>

        <!-- Display the latest update directly under the original review -->
        <div v-if="review.updates.length && !showUpdates[review._id]">
          <div class="update">
            <div class="review-header">
              <h4 class="reviewer-name">{{ review.reviewer.name }}</h4>
              <div class="update-tag">Update</div>
              <div class="rating">
                <span v-for="n in 5" :key="n" class="star">
                  {{
                    n <= review.updates[review.updates.length - 1].rating
                      ? "★"
                      : "☆"
                  }}
                </span>
              </div>
            </div>
            <p class="review-date">
              {{
                new Date(
                  review.updates[review.updates.length - 1].date
                ).toLocaleDateString()
              }}
            </p>
            <p class="review-comment">
              {{ review.updates[review.updates.length - 1].comment }}
            </p>
          </div>
        </div>

        <!-- Show other replies (updates and business replies) if available -->
        <div v-if="review.updates.length > 1 || review.businessReplies.length">
          <button
            @click="toggleUpdates(review._id)"
            class="show-updates-button"
          >
            {{ showUpdates[review._id] ? "Hide Replies" : "Show Replies" }} ({{
              review.updates.length + review.businessReplies.length
            }})
          </button>
          <transition name="slide-fade" mode="out-in">
            <div v-if="showUpdates[review._id]">
              <div
                v-for="item in sortedUpdatesAndReplies(review)"
                :key="item._id"
                class="update"
                :class="{ 'business-reply': item.isBusinessReply }"
              >
                <div class="review-header">
                  <h4 class="reviewer-name">
                    {{
                      item.isBusinessReply
                        ? getBusinessName(item.businessRep)
                        : review.reviewer.name
                    }}
                  </h4>
                  <div
                    v-if="item.isBusinessReply && isPremium"
                    class="verified-tag"
                  >
                    ✔
                  </div>
                  <div v-if="!item.isBusinessReply" class="rating">
                    <span v-for="n in 5" :key="n" class="star">
                      {{ n <= item.rating ? "★" : "☆" }}
                    </span>
                  </div>
                </div>
                <p class="review-date">
                  {{ new Date(item.date).toLocaleDateString() }}
                </p>
                <p class="review-comment">{{ item.comment }}</p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Business reply section -->
        <div v-if="isBusinessOwner" class="business-reply-section">
          <textarea
            v-model="newReply[review._id]"
            placeholder="Write a reply..."
          ></textarea>
          <p v-if="error" class="error-message">{{ error }}</p>
          <SubcomponentsLoadingButton
            :isLoading="loading"
            text="Submit Reply"
            @click="submitReply(review._id)"
            class="submit-button"
          />
        </div>
      </div>
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
  isPremium: {
    type: Boolean,
    required: true,
  },
});

const store = useStore();
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

function toggleUpdates(reviewId) {
  showUpdates.value[reviewId] = !showUpdates.value[reviewId];
}

function sortedUpdatesAndReplies(review) {
  const updates = review.updates.map((update) => ({
    ...update,
    isBusinessReply: false,
  }));
  const replies = review.businessReplies.map((reply) => ({
    ...reply,
    isBusinessReply: true,
  }));
  return [...updates, ...replies].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

function getBusinessName(businessRep) {
  return props.isPremium ? props.contractor.company : businessRep;
}

async function submitReply(reviewId) {
  if (newReply.value[reviewId].trim()) {
    loading.value = true;
    error.value = "";
    console.log("user name: ", store.user.name);
    try {
      await $fetch("/api/reviews", {
        method: "POST",
        body: {
          contractor: props.contractor._id,
          reviewId,
          businessRep: store.user.name,
          reply: newReply.value[reviewId],
        },
      });
      newReply.value[reviewId] = "";
      fetchReviews();
      location.reload(); // Reload page on successful submission
    } catch (error) {
      console.error("Failed to submit reply:", error);
      error.value = "Failed to submit reply. Please try again.";
    } finally {
      loading.value = false;
    }
  }
}

onMounted(() => {
  fetchReviews();
  if (props.contractor) {
    availableTags.value = props.contractor.tags;
  }
});
</script>

<style scoped>
.reviews-page {
  display: flex;
  gap: 20px;
  max-width: 1300px;
  margin: 0 auto 0 0;
  padding: 2rem 4rem;
}

.left-column {
  width: 35%;
}

.filters {
  color: black;
  height: auto;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review {
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.update-tag {
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
}

.verified-tag {
  margin-left: 5px;
  font-size: 14px;
  color: #007bff;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  color: #ff9900;
  font-size: 20px;
}

.review-comment {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.review-tags {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.review-date {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.update {
  background: none;
  border: none;
  padding: 10px 0;
  margin-top: 5px;
  margin-left: 20px;
}

.update.business-reply {
  padding-left: 20px; /* Indent business replies */
}

.show-updates-button {
  background: none;
  color: #007bff;
  padding: 0;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  display: inline-block;
}

.show-updates-button:hover {
  text-decoration: underline;
}

.business-reply-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.business-reply-section textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
  resize: vertical;
}

.business-reply-section .submit-button {
  align-self: flex-end;
  width: auto; /* Adjust button width */
}

/* Transition for smooth dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
