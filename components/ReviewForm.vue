<template>
  <div>
    <div v-if="isLoggedIn">
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
        <!-- <div class="checkbox-group">
          <h4>Select Additional Factors</h4>
          <div class="checkbox-row">
            <label>
              <input type="checkbox" value="OTH" v-model="newReview.tags" />
              Other
            </label>
          </div>
        </div> -->
      </div>
      <textarea
        v-model="newReview.comment"
        placeholder="Write your review..."
      ></textarea>
      <input
        type="number"
        v-model="newReview.rating"
        min="1"
        max="5"
        placeholder="Rating (1-5)"
      />
      <button @click="submitReview">Submit Review</button>
    </div>
    <div v-else>
      <p>You need to sign in to leave a review.</p>
      <button @click="$emit('openLoginModal')">Login</button>
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
});

const newReview = ref({ rating: null, comment: "", tags: [] });
const store = useStore();
const isLoggedIn = computed(() => !!store.token);

async function submitReview() {
  if (newReview.value.comment.trim() && newReview.value.rating) {
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
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  }
}
</script>
  
  <style scoped>
.checkboxes {
  margin-bottom: 20px;
}

.checkbox-group {
  margin-bottom: 10px;
}

h4 {
  color: black;
}

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  color: black;
}

.checkbox-row input {
  margin-right: 5px;
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
</style>
  