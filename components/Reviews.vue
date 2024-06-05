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
        <div v-if="review.updates && review.updates.length">
          <button
            @click="toggleUpdates(review._id)"
            class="show-updates-button"
          >
            Show Replies ({{
              review.updates.length + review.businessReplies.length
            }})
          </button>
          <div v-if="showUpdates[review._id]">
            <div
              class="update"
              v-for="update in review.updates"
              :key="update._id"
            >
              <div class="review-header">
                <h4 class="reviewer-name">{{ review.reviewer.name }}</h4>
                <div class="rating">
                  <span v-for="n in 5" :key="n" class="star">
                    {{ n <= update.rating ? "★" : "☆" }}
                  </span>
                </div>
              </div>
              <p class="review-date">
                {{ new Date(update.date).toLocaleDateString() }}
              </p>
              <p class="review-comment">{{ update.comment }}</p>
            </div>
            <div
              class="business-reply"
              v-for="reply in review.businessReplies"
              :key="reply._id"
            >
              <div class="review-header">
                <h4 class="reviewer-name">
                  {{ reply.reviewer.name }} (Business)
                </h4>
              </div>
              <p class="review-date">
                {{ new Date(reply.date).toLocaleDateString() }}
              </p>
              <p class="review-comment">{{ reply.comment }}</p>
            </div>
          </div>
        </div>
        <div v-if="isBusinessOwner && !review.businessReplies.length">
          <textarea
            v-model="newReply[review._id]"
            placeholder="Write a reply..."
          ></textarea>
          <button @click="submitReply(review._id)">Submit Reply</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

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
});

const reviews = ref([]);
const filteredReviews = ref([]);
const selectedRating = ref(null);
const selectedTags = ref([]);
const ratingCounts = ref([0, 0, 0, 0, 0]);
const availableTags = ref([]);
const showUpdates = ref({});
const newReply = ref({});

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
    ratingCounts.value[review.rating - 1]++;
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
    const ratingMatch = selectedRating.value
      ? review.rating === selectedRating.value
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

async function submitReply(reviewId) {
  if (newReply.value[reviewId].trim()) {
    try {
      await $fetch("/api/reviews", {
        method: "POST",
        body: {
          contractorId: props.contractor._id,
          reviewId,
          reply: newReply.value[reviewId],
        },
      });
      newReply.value[reviewId] = "";
      fetchReviews();
    } catch (error) {
      console.error("Failed to submit reply:", error);
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
</style>
