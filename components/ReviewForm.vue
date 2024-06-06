<template>
  <div>
    <div v-if="isBusinessOwner && isLoggedIn">
      <p>You represent this business. Reply to reviews below!</p>
    </div>
    <div v-else-if="isLoggedIn">
      <div v-if="existingReview" class="review">
        <div class="review-header">
          <h4>Original Review</h4>
          <div class="rating">
            <span v-for="n in 5" :key="n" class="star">
              {{ n <= existingReview.rating ? "★" : "☆" }}
            </span>
          </div>
        </div>
        <p class="review-date">
          {{ new Date(existingReview.date).toLocaleDateString() }}
        </p>
        <p class="review-comment">{{ existingReview.comment }}</p>
        <p
          v-if="existingReview.tags && existingReview.tags.length"
          class="review-tags"
        >
          <strong>Tags:</strong>
          {{
            existingReview.tags.map((tag) => tagDescriptions[tag]).join(", ")
          }}
        </p>
        <div v-if="existingReview.updates && existingReview.updates.length">
          <h5>Updates:</h5>
          <div
            v-for="update in existingReview.updates"
            :key="update._id"
            class="update"
          >
            <div class="review-header">
              <h4>Update</h4>
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
        </div>
      </div>
      <h4 class="review-title">
        {{ existingReview ? "Update Your Review" : "Leave a Review" }}
      </h4>
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
      <SubcomponentsLoadingButton
        :text="existingReview ? 'Update Review' : 'Submit Review'"
        :isLoading="loading"
        @click="submitReview"
      />
    </div>
    <div v-else>
      <p>You need to sign in to leave a review.</p>
      <button @click="openLoginModal">Login</button>
    </div>
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SubcomponentsLoadingButton from "~/components/Subcomponents/LoadingButton.vue";
import LoginModal from "~/components/LoginModal.vue";

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

const newReview = ref({ rating: null, comment: "", tags: [] });
const hoverRating = ref(0);
const existingReview = ref(null);
const store = useStore();
const isLoggedIn = computed(() => !!store.token);
const loading = ref(false);
const showLoginModal = ref(false);

async function fetchExistingReview() {
  if (isLoggedIn.value) {
    try {
      const response = await $fetch(
        `/api/reviews?contractor=${props.contractor._id}&user=${store.user._id}`
      );
      existingReview.value = response || null;
      console.log(existingReview.value);
      if (response) {
        newReview.value = {
          rating: response.rating,
          comment: "",
          tags: response.tags,
        };
      }
    } catch (error) {
      console.error("Failed to fetch existing review:", error);
    }
  }
}

function setRating(rating) {
  newReview.value.rating = rating;
}

async function submitReview() {
  if (newReview.value.comment.trim() && newReview.value.rating) {
    loading.value = true;
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
      console.log("Review submitted:", response);
      newReview.value = { rating: 1, comment: "", tags: [] };
      fetchExistingReview();
      location.reload();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      loading.value = false;
    }
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
  gap: 40px;
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

.review {
  background: #ffffff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
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
  background: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
}

.review-title {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0 10px;
  color: #333;
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
</style>
