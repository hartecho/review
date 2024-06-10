<template>
  <div class="review">
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
    <div
      ref="latestUpdateWrapper"
      class="latest-update-wrapper"
      v-if="review.updates[0]"
    >
      <div class="update latest-update">
        <div class="review-header">
          <h4 class="reviewer-name">{{ review.reviewer.name }}</h4>
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
        <div class="update-tag">Updated Review</div>
      </div>
    </div>

    <!-- Show other replies (updates and business replies) if available -->
    <div v-if="review.updates.length > 1 || review.businessReplies.length">
      <button @click="toggleReplies" class="show-updates-button">
        {{ showReplies ? "Hide Replies" : "Show All Replies" }} ({{
          review.updates.length + review.businessReplies.length
        }})
      </button>
      <div
        ref="repliesContainer"
        :class="{ open: showReplies }"
        class="replies-container"
      >
        <div
          v-for="item in sortedUpdatesAndReplies(review)"
          :key="item._id"
          class="update"
          :class="{
            'business-reply': item.isBusinessReply,
            pro: item.isBusinessReply && isPro,
            'latest-update':
              review.updates.length &&
              item._id === review.updates[review.updates.length - 1]._id &&
              !item.isBusinessReply,
          }"
        >
          <div class="review-header">
            <h4 class="reviewer-name">
              {{
                item.isBusinessReply
                  ? getBusinessName(item.businessRep)
                  : review.reviewer.name
              }}
              <img
                v-if="item.isBusinessReply && isPro"
                src="/GoldenCheck.webp"
                alt="Verified Pro"
                class="verified-tag"
              />
            </h4>
            <div v-if="!item.isBusinessReply" class="rating">
              <span v-for="n in 5" :key="n" class="star">
                {{ n <= item.rating ? "★" : "☆" }}
              </span>
            </div>
            <div
              v-if="
                review.updates.length &&
                item._id === review.updates[review.updates.length - 1]._id &&
                !item.isBusinessReply
              "
              class="update-tag"
            >
              Updated Review
            </div>
          </div>
          <p class="review-date">
            {{ new Date(item.date).toLocaleDateString() }}
          </p>
          <p class="review-comment">{{ item.comment }}</p>
        </div>
      </div>
    </div>

    <!-- Business reply section -->
    <div v-if="isBusinessOwner" class="business-reply-section">
      <textarea v-model="newReply" placeholder="Write a reply..."></textarea>
      <p v-if="error" class="error-message">{{ error }}</p>
      <SubcomponentsLoadingButton
        :isLoading="loading"
        text="Submit Reply"
        @click="submitReply"
        class="submit-button"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  review: {
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
  contractor: {
    type: Object,
    required: true,
  },
  fetchReviews: {
    type: Function,
    required: true,
  },
});

const store = useStore();
const showReplies = ref(false);
const newReply = ref("");
const loading = ref(false);
const error = ref("");

const latestUpdateWrapper = ref(null);
const repliesContainer = ref(null);

const hasUpdates = computed(() => review.updates.length > 0);
const hasReplies = computed(
  () => review.updates.length > 1 || review.businessReplies.length > 0
);

async function toggleReplies() {
  const repliesEl = repliesContainer.value;
  const latestUpdateEl = latestUpdateWrapper.value;

  if (!latestUpdateEl) {
    if (showReplies.value) {
      repliesEl.style.maxHeight = "0";
    } else {
      repliesEl.style.maxHeight = "100rem";
    }
  } else {
    if (showReplies.value) {
      repliesEl.style.maxHeight = "0";
      setTimeout(() => {
        latestUpdateEl.style.maxHeight = "100rem";
      }, 1000);
    } else {
      latestUpdateEl.style.maxHeight = "0";
      setTimeout(() => {
        repliesEl.style.maxHeight = "100rem";
      }, 1000);
    }
  }
  showReplies.value = !showReplies.value;
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
  return props.isPro ? props.contractor.company : businessRep + " (Owner)";
}

async function submitReply() {
  if (newReply.value.trim()) {
    loading.value = true;
    error.value = "";
    try {
      await $fetch("/api/reviews", {
        method: "POST",
        body: {
          contractor: props.contractor._id,
          reviewId: props.review._id,
          businessRep: store.user.name,
          reply: newReply.value,
        },
      });
      newReply.value = "";
      // Fetch updated reviews to refresh the component state
      props.fetchReviews();
    } catch (error) {
      console.error("Failed to submit reply:", error);
      error.value = "Failed to submit reply. Please try again.";
    } finally {
      loading.value = false;
    }
  } else {
    error.value = "Please enter a reply before submitting.";
  }
}
</script>

<style scoped>
.review {
  background: #fff;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
  position: relative;
}

.reviewer-name {
  display: inline-flex;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.update-tag {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
}

.verified-tag {
  margin-left: 10px;
  margin-bottom: 3px;
  width: 20px;
  height: 20px;
}

.rating {
  display: flex;
  align-items: center;
}

.star {
  color: #ff9900;
  font-size: 20px;
}

.review-comment,
.review-tags {
  font-size: 16px;
  color: #333;
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
  padding-left: 20px;
  position: relative;
  margin-bottom: 20px;
}

.latest-update-wrapper {
  transition: max-height 1s ease;
  max-height: 100rem;
  overflow: hidden;
}

.latest-update {
  background-color: #f0f8ff;
  border-left: 4px solid #007bff;
  padding: 10px;
  margin-left: 0;
  border-radius: 8px;
}

.update.business-reply {
  border-left: 4px solid #a3a3a3;
  padding-left: 20px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.update.business-reply.pro {
  border-left: 4px solid #ffd700;
  background: #fff8dc;
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

.replies-container {
  margin-top: 20px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 1s ease;
}

.replies-container.open {
  max-height: 1000px; /* Arbitrary large value to ensure full expansion */
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
  align-self: flex-start;
  width: auto;
}

.error-message {
  color: red;
  font-size: 14px;
}
</style>
