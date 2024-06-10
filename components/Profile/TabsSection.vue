<template>
  <section class="tabs-section">
    <div class="tabs">
      <button
        @click="activeTab = 'about'"
        :class="{ active: activeTab === 'about' }"
      >
        About
      </button>
      <button
        @click="activeTab = 'reviews'"
        :class="{ active: activeTab === 'reviews' }"
      >
        Leave a Review
      </button>
    </div>
    <div class="tab-content" v-if="activeTab === 'about'">
      <h3>Contact Information</h3>
      <div class="contact-info">
        <p><strong>Email:</strong> {{ contractor.email }}</p>
        <p><strong>Phone:</strong> {{ contractor.phone }}</p>
        <p>
          <strong>Address:</strong> {{ contractor.address.city }},
          {{ contractor.address.state }}
        </p>
      </div>
    </div>
    <div class="tab-content" v-if="activeTab === 'reviews'">
      <ReviewForm
        :contractor="contractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :isPro="isPro"
      />
    </div>
  </section>
</template>
  
  <script setup>
const props = defineProps({
  contractor: Object,
  tagDescriptions: Object,
  isBusinessOwner: Boolean,
  isPro: Boolean,
});

const activeTab = ref("reviews");
</script>
  
  <style scoped>
.tabs-section {
  text-align: left;
  max-width: 1400px;
  padding: 2rem 4rem;
  margin: 0 auto;
  margin-top: 40px;
}

.tabs {
  display: inline-flex;
  border-bottom: 2px solid #ddd;
  gap: 10px;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 20px;
  color: black;
  transition: color 0.3s, border-bottom 0.3s;
}

.tabs button:hover {
  color: #007bff;
}

.tabs button.active {
  border-bottom: 2px solid #007bff;
  font-weight: bold;
}

.tab-content {
  max-width: 1200px;
  margin: 20px 0;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  /* box-shadow: 0 0px 4px rgba(0, 0, 0, 0.2); */
  width: 100%;
}

.contact-info p {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}
</style>
  