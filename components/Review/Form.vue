<template>
  <div>
    <div v-if="isBusinessOwner && isLoggedIn">
      <p>You represent this business. Reply to reviews below!</p>
    </div>
    <div v-else-if="isLoggedIn">
      <h4 class="review-title" v-if="existingReview">
        Your Review History with {{ contractor.company }}
      </h4>
      <div v-if="existingReview">
        <ReviewReviews
          :review="existingReview"
          :tagDescriptions="tagDescriptions"
          :isBusinessOwner="isBusinessOwner"
          :isPro="isPro"
          :contractor="contractor"
          :fetchReviews="fetchExistingReview"
        />
      </div>

      <h4
        :class="['review-title-dropdown', { 'is-button': existingReview }]"
        @click="toggleReviewForm"
      >
        {{ existingReview ? "Update Your Review" : "Leave a Review" }}
        <span
          v-if="existingReview"
          class="arrow"
          :class="{ open: showReviewForm }"
          >▼</span
        >
      </h4>
      <div v-if="showReviewForm || !existingReview">
        <div class="star-rating">
          <p>Choose your star rating:</p>
          <div class="stars-input">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= newReview.rating || n <= hoverRating }"
              @mouseover="hoverRating = n"
              @mouseleave="hoverRating = 0"
              @click="setRating(n)"
            >
              ★
            </span>
          </div>
        </div>
        <div class="checkboxes">
          <div class="checkbox-group">
            <h4>Select Job Types</h4>
            <div class="checkbox-row">
              <label v-for="tag in contractor.tags" :key="tag">
                <input type="checkbox" :value="tag" v-model="newReview.tags" />
                {{ tagDescriptions[tag] }}
              </label>
            </div>
          </div>
        </div>
        <textarea
          v-model="newReview.comment"
          placeholder="Write your review..."
        ></textarea>
        <p v-if="error" class="error-message">{{ error }}</p>
        <SubcomponentsLoadingButton
          :text="existingReview ? 'Update Review' : 'Submit Review'"
          :isLoading="loading"
          @click="submitReview"
        />
      </div>
    </div>
    <div v-else>
      <p>You need to sign in to leave a review.</p>
      <button @click="openLoginModal">Login</button>
    </div>
    <NavFooterPreloadLoginModal
      v-if="showLoginModal"
      @close="closeLoginModal"
    />
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

const newReview = ref({ rating: null, comment: "", tags: [] });
const hoverRating = ref(0);
const existingReview = ref(null);
const store = useStore();
const isLoggedIn = computed(() => !!store.token);
const loading = ref(false);
const showLoginModal = ref(false);
const error = ref("");
const showReviewForm = ref(true);

async function fetchExistingReview() {
  if (isLoggedIn.value) {
    try {
      const response = await $fetch(
        `/api/reviews?contractor=${props.contractor._id}&user=${store.user._id}`
      );
      existingReview.value = response || null;
      if (response) {
        newReview.value = {
          rating: response.rating,
          comment: "",
          tags: response.tags,
        };
        showReviewForm.value = false; // Hide the form initially if there's an existing review
      } else {
        showReviewForm.value = true; // Show the form if there's no existing review
      }
    } catch (error) {
      console.error("Failed to fetch existing review:", error);
    }
  }
}

function setRating(rating) {
  newReview.value.rating = rating;
}

function toggleReviewForm() {
  if (existingReview.value) {
    showReviewForm.value = !showReviewForm.value;
  }
}

async function submitReview() {
  if (newReview.value.comment.trim() && newReview.value.rating) {
    loading.value = true;
    error.value = "";
    try {
      const response = await $fetch("/api/reviews", {
        method: "POST",
        body: {
          contractor: props.contractor._id,
          reviewer: store.user._id,
          rating: newReview.value.rating,
          comment: newReview.value.comment,
          tags: newReview.value.tags,
        },
      });
      newReview.value = { rating: 1, comment: "", tags: [] };
      fetchExistingReview();
      location.reload();
    } catch (error) {
      console.error("Failed to submit review:", error);
      error.value = "Failed to submit review. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    error.value = "Please fill in all fields before submitting.";
  }
}

function openLoginModal() {
  showLoginModal.value = true;
}

function closeLoginModal() {
  showLoginModal.value = false;
}

onMounted(fetchExistingReview);
</script>

<style scoped>
.checkboxes {
  margin-bottom: 20px;
}

.checkbox-group {
  margin-bottom: 10px;
}

h4,
h5 {
  color: black;
}

h5 {
  margin-top: 1rem;
}

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  gap: 10px;
  margin-left: -10px;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.checkbox-row label:hover {
  background-color: #f0f0f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.checkbox-row input {
  margin-right: 10px;
  accent-color: #007bff; /* Change the checkbox color */
  width: 18px;
  height: 18px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

input[type="number"] {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px;
}

input[type="number"]:focus {
  outline: none;
  border-color: #007bff;
}

button {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.review-title {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 10px;
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.review-title-dropdown {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
  display: flex;
  align-items: center;
}

.review-title-dropdown.is-button {
  cursor: pointer;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-radius: 5px;
  transition: background-color 0.3s, box-shadow 0.3s;
  width: 19rem;
}

.review-title-dropdown.is-button:hover {
  background-color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
  margin-left: 10px;
}

.arrow.open {
  transform: rotate(180deg);
}

.star-rating {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 20px;
}

p {
  color: black;
  margin: 1rem 0;
}

.stars-input {
  display: flex;
}

.stars-input .star {
  font-size: 30px;
  cursor: pointer;
}

.stars-input .star.filled {
  color: #ff9900;
}

.stars-input .star:not(.filled) {
  color: #ddd;
}

.error-message {
  color: red;
  font-size: 14px;
}

@media (max-width: 768px) {
  .review-title-dropdown.is-button {
    width: auto;
  }

  .review-title-dropdown {
    font-size: 20px;
  }

  .arrow {
    font-size: 18px;
  }

  .stars-input .star {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .checkbox-row {
    gap: 5px;
    margin-left: 0;
  }

  .checkbox-row label {
    font-size: 12px;
    padding: 4px 8px;
  }

  .review-title-dropdown.is-button {
    width: auto;
    padding: 8px 16px;
  }

  .review-title-dropdown {
    font-size: 18px;
  }

  .arrow {
    font-size: 16px;
  }

  .stars-input .star {
    font-size: 20px;
  }

  .error-message {
    font-size: 12px;
  }
}
</style>
