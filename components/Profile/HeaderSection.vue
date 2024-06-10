<template>
  <section class="profile-header-section">
    <div class="profile-header">
      <div class="profile-info">
        <div class="profile-image">
          <img :src="resolvedImgPath()" alt="Contractor Picture" />
        </div>
        <div class="profile-details">
          <h1>{{ contractor.company }}</h1>
          <div class="ratings-section">
            <p v-if="contractor.ratings > 0" class="star-rating">
              {{ contractor.ratings.toFixed(1) }}
            </p>
            <div v-if="contractor.ratings > 0" class="stars">
              <span v-for="n in 5" :key="n" class="star">
                {{ n <= roundedRating ? "★" : "☆" }}
              </span>
            </div>
            <p v-else class="no-reviews">Be the first to leave a review!</p>
          </div>
          <ul class="job-types">
            <li v-for="(tag, index) in contractor.tags" :key="tag">
              {{ tagDescriptions[tag]
              }}<span v-if="index < contractor.tags.length - 1"> - </span>
            </li>
          </ul>
          <div class="actions">
            <button
              class="contact-contractor-button"
              @click="contactContractor"
            >
              Contact Contractor
            </button>
            <button class="report-button">Report an Issue</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
  <script setup>
const props = defineProps({
  contractor: Object,
  tagDescriptions: Object,
  contactContractor: Function,
  roundedRating: Number,
});

const resolvedImgPath = () => {
  return `/${props.contractor.picture}`;
};
</script>
  
  
<style scoped>
.profile-header-section {
  font-family: Arial, sans-serif;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 4rem;
  height: 100%;
}

.profile-header {
  display: flex;
  justify-content: left;
}

.profile-info {
  text-align: left;
  display: flex;
  width: 100%;
  gap: 3rem;
  text-shadow: 2px 2px 1px black;
}

.profile-image {
}

.profile-image img {
  width: 15rem;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.profile-details {
  flex: 1;
}

.profile-details h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.ratings-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.star-rating {
  font-size: 36px;
}

.no-reviews {
  font-size: 24px;
}

.stars {
  display: flex;
}

.star {
  color: #ff9900;
  font-size: 36px;
}

.job-types {
  list-style: none;
  padding: 0;
  margin: 10px 0;
  font-size: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.job-types li {
  display: inline;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.contact-contractor-button,
.report-button {
  background-color: #007bff;
  color: white;
  text-shadow: 1px 1px 2px black;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.contact-contractor-button:hover,
.report-button:hover {
  background-color: #0056b3;
}
</style>
