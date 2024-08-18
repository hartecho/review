<template>
  <div class="edit-reviews-container">
    <h1>Edit Reviews</h1>

    <div class="filter-section">
      <label for="businessFilter">Filter by Business:</label>
      <select v-model="selectedBusinessId" @change="filterReviews">
        <option value="">All Businesses</option>
        <option
          v-for="business in uniqueBusinesses"
          :key="business.businessId"
          :value="business.businessId"
        >
          {{ business.businessName }} ({{ business.businessType }})
        </option>
      </select>
      <button @click="clearFilter">Clear Filter</button>
    </div>

    <div class="delete-all-section">
      <label for="deleteConfirmation"
        >Type "Delete All Reviews" to delete all reviews:</label
      >
      <input
        type="text"
        v-model="deleteConfirmation"
        id="deleteConfirmation"
        placeholder="Delete All Reviews"
      />
      <button
        @click="deleteAllReviews"
        :disabled="deleteConfirmation !== 'Delete All Reviews'"
      >
        Delete All Reviews
      </button>
    </div>

    <div class="reviews-list">
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
          <button @click="editReview(review)">Edit Review</button>
          <button @click="deleteReview(review._id)">Delete Review</button>
          <button @click="reassignReview(review)">Reassign Business</button>
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

        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>

    <div v-if="reassigningReview" class="edit-modal">
      <h2>Reassign Business</h2>
      <form @submit.prevent="performReassignment">
        <label for="newBusinessId">New Business ID:</label>
        <input v-model="newBusinessId" id="newBusinessId" required />

        <button type="submit">Reassign</button>
        <button type="button" @click="cancelReassign">Cancel</button>
      </form>
    </div>
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

const availableTags = [
  "GEN",
  "ARC",
  "ENG",
  "DB",
  "CON",
  "EXC",
  "GRD",
  "STL",
  "FRM",
  "DRY",
  "FLR",
  "ROF",
  "SID",
  "INS",
  "WTR",
  "REN",
  "REM",
  "DEM",
  "FIN",
  "FAC",
  "HIS",
  "LND",
  "CAB",
  "CTP",
  "CUR",
  "TLE",
  "GLS",
  "ELEC",
  "HVAC",
  "PLM",
  "AV",
  "SEC",
  "ELEV",
  "UTIL",
  "SOL",
  "SPC",
  "SPEQ",
  "CLG",
  "IEQ",
  "LOG",
  "WND",
  "WARE",
  "ENV",
  "ENVC",
  "ASB",
  "LEAD",
  "FPS",
  "SAF",
  "CKE",
  "LMEQ",
  "DTCM",
  "IEQ",
  "ACOUST",
  "AGG",
  "BRK",
  "CMP",
  "CNTN",
  "CONV",
  "CNVY",
  "DRY",
  "ELE",
  "FAB",
  "FRM",
  "FURN",
  "GLAS",
  "GRDN",
  "HRDW",
  "HVACS",
  "INSUL",
  "LGT",
  "LUM",
  "MAR",
  "MTL",
  "PAIN",
  "PLMB",
  "PLST",
  "RFMS",
  "SAND",
  "SEAL",
  "STON",
  "SURF",
  "TAP",
  "TEMP",
  "TOOLS",
  "WTRS",
  "OTH",
];

// Fetch and cache reviews
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
  } catch (error) {
    console.error("Failed to update review:", error);
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
  } catch (error) {
    console.error("Failed to delete review:", error);
  }
}

async function deleteAllReviews() {
  try {
    const response = await $fetch("/api/reviews/deleteAll", {
      method: "DELETE",
    });
    console.log(response.message);
  } catch (error) {
    console.error("Error deleting all reviews:", error);
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
  } catch (error) {
    console.error("Failed to reassign review:", error);
  }
}

function cancelReassign() {
  reassigningReview.value = null;
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.edit-reviews-container {
  padding: 20px;
}

.filter-section,
.delete-all-section {
  margin-bottom: 20px;
}

.review-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.edit-buttons {
  margin-top: 10px;
}

.edit-buttons button {
  margin-right: 5px;
}

.edit-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  z-index: 1000;
}

.edit-modal h2 {
  margin-top: 0;
}

.edit-modal form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
