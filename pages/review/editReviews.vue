<template>
  <div class="wrapper">
    <h1>Add/Update Review</h1>

    <div class="content">
      <div class="section">
        <h2>Select Business</h2>
        <select v-model="selectedBusinessId" @change="loadReviews">
          <option disabled value="">Please select one</option>
          <option
            v-for="business in businesses"
            :key="business._id"
            :value="business._id"
          >
            {{ business.name }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input
            type="number"
            v-model.number="review.rating"
            min="1"
            max="5"
            placeholder=" "
          />
          <label>Rating</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="review.comment" placeholder=" " />
          <label>Comment</label>
        </div>
      </div>

      <div class="section">
        <h2>Reviewer Information</h2>
        <select v-model="review.reviewer" @change="updateReviewer">
          <option disabled value="">Please select a reviewer</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>Tags</h2>
        <ProfileDropdown
          label="Select Tags"
          :items="tagDescriptions"
          :selectedItems="review.tags"
          @update:selectedItems="updateTags"
        />
      </div>

      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addReview">Add Review</button>
        <button @click="updateReview">Update Review</button>
        <button @click="deleteReview">Delete Review</button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { tagDescriptions } from "/utils/tagDescriptions.js";

const businesses = ref([]);
const users = ref([]);
const selectedBusinessId = ref("");
const review = ref({
  businessId: "",
  businessType: "",
  reviewer: "",
  rating: 1,
  comment: "",
  tags: [],
});

const getBusinesses = async () => {
  try {
    const response = await $fetch("/api/businesses");
    businesses.value = response || [];
  } catch (error) {
    console.error("Error fetching businesses:", error);
  }
};

const getUsers = async () => {
  try {
    const response = await $fetch("/api/users");
    users.value = response || [];
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const loadReviews = async () => {
  try {
    const response = await $fetch(
      `/api/reviews?businessId=${selectedBusinessId.value}`
    );
    if (response) {
      const latestReview = response[0];
      review.value = { ...latestReview };
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
};

const addReview = async () => {
  try {
    const newReview = {
      ...review.value,
      businessId: selectedBusinessId.value,
      businessType: businesses.value.find(
        (b) => b._id === selectedBusinessId.value
      ).type,
    };
    await $fetch("/api/reviews", {
      method: "POST",
      body: newReview,
    });
    alert("Review added successfully");
    loadReviews();
  } catch (error) {
    alert("Error adding review: " + error.message);
    console.error("Error adding review:", error);
  }
};

const updateReview = async () => {
  try {
    if (review.value._id) {
      await $fetch(`/api/reviews/${review.value._id}`, {
        method: "PUT",
        body: review.value,
      });
      alert("Review updated successfully");
      loadReviews();
    }
  } catch (error) {
    alert("Error updating review: " + error.message);
    console.error("Error updating review:", error);
  }
};

const deleteReview = async () => {
  try {
    if (review.value._id) {
      await $fetch(`/api/reviews/${review.value._id}`, {
        method: "DELETE",
      });
      alert("Review deleted successfully");
      loadReviews();
    }
  } catch (error) {
    alert("Error deleting review: " + error.message);
    console.error("Error deleting review:", error);
  }
};

const updateTags = (tags) => {
  review.value.tags = tags;
};

const updateReviewer = (reviewer) => {
  review.value.reviewer = reviewer;
};

onMounted(() => {
  getBusinesses();
  getUsers();
});
</script>
  
  <style scoped>
.wrapper {
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

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"],
.input-wrapper input[type="email"],
.input-wrapper input[type="number"],
.input-wrapper select {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
  background: #fff;
}

.input-wrapper input[type="text"]:focus,
.input-wrapper input[type="email"]:focus,
.input-wrapper input[type="number"]:focus,
.input-wrapper select:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper select:focus + label,
.input-wrapper select:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}

button {
  background-color: #ff8210;
  border: none;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 0.5rem 0 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e65a00;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-buttons {
  text-align: center;
}
</style>
  