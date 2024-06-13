<template>
  <div class="results-container">
    <ul v-if="filteredContractors.length" class="results-list">
      <li
        v-for="contractor in filteredContractors"
        :key="contractor._id"
        class="results-item"
        @click="goToContractorPage(contractor._id)"
      >
        <img :src="contractor.picture" alt="Picture" class="contractor-logo" />
        <div class="contractor-info">
          <h3>
            <span
              v-for="(part, index) in splitText(contractor.company)"
              :key="index"
              :class="{ highlight: part.match }"
            >
              {{ part.text }}
            </span>
          </h3>
          <p>
            <span
              v-for="(part, index) in splitText(
                `${contractor.address.city}, ${contractor.address.state}`
              )"
              :key="index"
              :class="{ highlight: part.match }"
            >
              {{ part.text }}
            </span>
          </p>
          <ul class="jobs-list">
            <li
              v-for="(job, index) in displayJobs(contractor.tags)"
              :key="index"
              v-html="highlightMatch(job)"
            ></li>
            <li v-if="contractor.tags.length > 3">...</li>
          </ul>
        </div>
        <div class="star-rating">
          <template v-if="contractor.ratings && contractor.ratings > 0">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= Math.round(contractor.ratings) }"
              >&#9733;</span
            >
          </template>
          <p v-else>No Reviews</p>
        </div>
      </li>
    </ul>
    <p v-else>No subcontractors found.</p>
  </div>
</template>
  
  <script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  filteredContractors: Array,
  searchQuery: String,
  tagDescriptions: Object,
});

const router = useRouter();

function goToContractorPage(contractorId) {
  router.push(`/contractor/${contractorId}`);
}

function splitText(text) {
  const query = props.searchQuery.toLowerCase();
  if (!query) return [{ text, match: false }];

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}

function displayJobs(tags) {
  const visibleTags = tags.slice(0, 3);
  return visibleTags.map((tag) => props.tagDescriptions[tag]);
}

function highlightMatch(text) {
  if (!text) return "";
  const query = props.searchQuery;
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}
</script>
  
<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 400px;
  overflow-y: auto;
  padding-top: 1rem;
  padding-right: 0.5rem;
}

/* Webkit-based browsers (Chrome, Safari, Edge) */
.results-container::-webkit-scrollbar {
  width: 8px;
}

.results-container::-webkit-scrollbar-track {
  background: transparent;
}

.results-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: opacity 0.3s ease;
  opacity: 0.5;
}

.results-container:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* Firefox */
.results-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.results-container:hover {
  scrollbar-color: rgba(255, 255, 255, 1) transparent;
}

/* For all browsers */
.results-container {
  overflow-y: auto;
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: thin; /* Firefox */
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.results-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.8);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.results-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.results-item:last-child {
  border-bottom: none;
}

.contractor-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
}

.contractor-info {
  flex: 1;
}

.contractor-info h3,
.contractor-info p {
  margin: 0;
  font-size: 16px;
  color: #fff;
}

.jobs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.jobs-list li {
  font-size: 14px;
  display: inline;
  margin-right: 5px;
}

.highlight {
  background-color: darkcyan;
  color: white;
}

.star-rating {
  position: absolute;
  top: 10px;
  right: 15px;
  text-align: center;
}

.star {
  font-size: 20px;
  color: #ccc;
}

.star.filled {
  color: #ffd700;
}

@media (max-width: 480px) {
  .results-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .contractor-logo {
    margin-bottom: 10px;
  }

  /* .star-rating {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 10px;
  } */

  .contractor-info h3,
  .contractor-info p {
    font-size: 14px;
  }

  .jobs-list li {
    font-size: 12px;
  }

  .star {
    font-size: 18px;
  }
}
</style>
