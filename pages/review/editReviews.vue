<template>
  <div class="edit-reviews-container">
    <h1>Edit Reviews</h1>

    <div class="filter-section section">
      <label for="businessFilter">Filter by Business:</label>
      <select
        v-model="selectedBusinessId"
        @change="filterReviews"
        class="dropdown-button"
      >
        <option value="">All Businesses</option>
        <option
          v-for="business in uniqueBusinesses"
          :key="business.businessId"
          :value="business.businessId"
        >
          {{ business.businessName }} ({{ business.businessType }})
        </option>
      </select>
      <button @click="clearFilter" class="action-button">Clear Filter</button>
    </div>

    <div class="delete-all-section section">
      <label for="deleteConfirmation"
        >Type "Delete All Reviews" to delete all reviews:</label
      >
      <input
        type="text"
        v-model="deleteConfirmation"
        id="deleteConfirmation"
        placeholder="Delete All Reviews"
        class="delete-confirmation-input"
      />
      <button
        @click="deleteAllReviews"
        :disabled="deleteConfirmation !== 'Delete All Reviews'"
        class="action-button"
      >
        Delete All Reviews
      </button>
    </div>

    <div class="reviews-list section">
      <div
        v-for="review in filteredReviews"
        :key="review._id"
        class="review-item"
      >
        <h2>{{ review.businessName }} ({{ review.businessType }})</h2>
        <p><strong>Reviewer:</strong> {{ review.reviewerName }}</p>
        <p><strong>Rating:</strong> {{ review.rating }}</p>
        <p><strong>Comment:</strong> {{ review.comment }}</p>
        <p><strong>Tags:</strong> {{ review.tags.join(", ") }}</p>
        <p>
          <strong>Date:</strong>
          {{ new Date(review.date).toLocaleDateString() }}
        </p>

        <h3>Business Replies</h3>
        <ul>
          <li v-for="reply in review.businessReplies" :key="reply._id">
            <strong>{{ reply.businessRep }}:</strong> {{ reply.comment }}
            <small> ({{ new Date(reply.date).toLocaleDateString() }})</small>
          </li>
        </ul>

        <h3>Review Updates</h3>
        <ul>
          <li v-for="update in review.updates" :key="update._id">
            <strong>Rating:</strong> {{ update.rating }} - {{ update.comment }}
            <small> ({{ new Date(update.date).toLocaleDateString() }})</small>
          </li>
        </ul>

        <div class="edit-buttons">
          <button @click="editReview(review)" class="action-button">
            Edit Review
          </button>
          <button @click="deleteReview(review._id)" class="action-button">
            Delete Review
          </button>
          <button @click="reassignReview(review)" class="action-button">
            Reassign Business
          </button>
        </div>
      </div>
    </div>

    <div v-if="editingReview" class="edit-modal">
      <h2>Edit Review</h2>
      <form @submit.prevent="updateReview">
        <label for="editRating">Rating:</label>
        <select v-model="editingReview.rating" id="editRating">
          <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
        </select>

        <label for="editComment">Comment:</label>
        <textarea v-model="editingReview.comment" id="editComment"></textarea>

        <label for="editTags">Tags:</label>
        <select v-model="editingReview.tags" id="editTags" multiple>
          <option v-for="tag in availableTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>

        <label for="editBusiness">Business:</label>
        <input
          v-model="editingReview.businessName"
          id="editBusiness"
          disabled
        />

        <label for="editReviewer">Reviewer:</label>
        <input
          v-model="editingReview.reviewerName"
          id="editReviewer"
          disabled
        />

        <div class="edit-buttons">
          <button type="submit" class="action-button">Save Changes</button>
          <button type="button" @click="cancelEdit" class="action-button">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div v-if="reassigningReview" class="edit-modal">
      <h2>Reassign Business</h2>
      <form @submit.prevent="performReassignment">
        <label for="newBusinessId">New Business ID:</label>
        <input
          v-model="newBusinessId"
          id="newBusinessId"
          required
          class="text-input"
        />

        <div class="edit-buttons">
          <button type="submit" class="action-button">Reassign</button>
          <button type="button" @click="cancelReassign" class="action-button">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Notification Popup -->
    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const reviews = ref([]);
const selectedBusinessId = ref("");
const editingReview = ref(null);
const reassigningReview = ref(null);
const newBusinessId = ref("");
const deleteConfirmation = ref("");

const notificationMessage = ref(""); // Notification message
const notificationType = ref("info"); // Notification type: 'info', 'success', 'error'

const availableTags = [
  // List of available tags
];

onMounted(async () => {
  try {
    const response = await $fetch("/api/reviews");
    reviews.value = response;
  } catch (error) {
    console.error("Failed to load reviews:", error);
  }
});

const uniqueBusinesses = computed(() => {
  const businessMap = new Map();
  reviews.value.forEach((review) => {
    if (!businessMap.has(review.businessId)) {
      businessMap.set(review.businessId, {
        businessId: review.businessId,
        businessName: review.businessName,
        businessType: review.businessType,
      });
    }
  });
  return Array.from(businessMap.values());
});

const filteredReviews = computed(() => {
  if (!selectedBusinessId.value) {
    return reviews.value;
  }
  return reviews.value.filter(
    (review) => review.businessId === selectedBusinessId.value
  );
});

function filterReviews() {
  // Trigger the recomputation of filteredReviews based on selectedBusinessId
}

function clearFilter() {
  selectedBusinessId.value = "";
}

function editReview(review) {
  editingReview.value = { ...review };
}

async function updateReview() {
  const updatedReview = editingReview.value;
  try {
    await $fetch(`/api/reviews/${updatedReview._id}`, {
      method: "PUT",
      body: updatedReview,
    });
    const index = reviews.value.findIndex((r) => r._id === updatedReview._id);
    reviews.value[index] = { ...updatedReview };
    editingReview.value = null;
    showNotification("Review updated successfully", "success");
  } catch (error) {
    console.error("Failed to update review:", error);
    showNotification("Failed to update review: " + error.message, "error");
  }
}

function cancelEdit() {
  editingReview.value = null;
}

async function deleteReview(reviewId) {
  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
    reviews.value = reviews.value.filter((r) => r._id !== reviewId);
    showNotification("Review deleted successfully", "success");
  } catch (error) {
    console.error("Failed to delete review:", error);
    showNotification("Failed to delete review: " + error.message, "error");
  }
}

async function deleteAllReviews() {
  try {
    const response = await $fetch("/api/reviews/deleteAll", {
      method: "DELETE",
    });
    console.log(response.message);
    showNotification("All reviews deleted successfully", "success");
  } catch (error) {
    console.error("Error deleting all reviews:", error);
    showNotification("Error deleting all reviews: " + error.message, "error");
  }
}

function reassignReview(review) {
  reassigningReview.value = review;
}

async function performReassignment() {
  try {
    reassigningReview.value.businessId = newBusinessId.value;
    await $fetch(`/api/reviews/${reassigningReview.value._id}/reassign`, {
      method: "POST",
      body: { newBusinessId: newBusinessId.value },
    });
    reassigningReview.value = null;
    newBusinessId.value = "";
    showNotification("Review reassigned successfully", "success");
  } catch (error) {
    console.error("Failed to reassign review:", error);
    showNotification("Failed to reassign review: " + error.message, "error");
  }
}

function cancelReassign() {
  reassigningReview.value = null;
}

function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.edit-reviews-container {
  padding: 2rem;
  width: 100%;
  margin: 0;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.review-item {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}

.edit-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-buttons .action-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
}

.edit-buttons .action-button:hover {
  background-color: #ff8210;
  color: white;
}

.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.edit-modal h2 {
  margin-top: 0;
  font-size: 1.8rem;
}

.edit-modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.delete-confirmation-input {
  width: 60%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  margin-bottom: 1.5rem;
}

.delete-confirmation-input:focus {
  border-color: #ff8210;
  outline: none;
}
</style>
