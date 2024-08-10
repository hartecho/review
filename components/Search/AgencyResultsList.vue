<template>
  <div class="results-container">
    <ul v-if="filteredAgencies.length" class="results-list">
      <li
        v-for="agency in filteredAgencies"
        :key="agency._id"
        class="results-item"
        @click="goToAgencyPage(agency._id)"
      >
        <img :src="'/' + agency.picture" alt="Picture" class="agency-logo" />
        <div class="agency-info">
          <h3>
            <span
              v-for="(part, index) in splitText(agency.company)"
              :key="index"
              :class="{ highlight: part.match }"
            >
              {{ part.text }}
            </span>
          </h3>
          <p>
            Operating States:
            <span
              v-for="(part, index) in splitText(
                agency.operatingStates.join(', ')
              )"
              :key="index"
              :class="{ highlight: part.match }"
            >
              {{ part.text }}
            </span>
          </p>
        </div>
        <div class="star-rating">
          <template v-if="agency.ratings && agency.ratings > 0">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ filled: n <= Math.round(agency.ratings) }"
              >&#9733;</span
            >
          </template>
          <p v-else>No Reviews</p>
        </div>
      </li>
    </ul>
    <div v-else class="no-results">
      <p>No agencies found.</p>
      <button @click="goToAddAgencyPage">Add Agency</button>
    </div>
  </div>
</template>
    
    <script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  filteredAgencies: Array,
  searchQuery: String,
});

const router = useRouter();

function goToAgencyPage(agencyId) {
  router.push(`/agency/${agencyId}`);
}

function goToAddAgencyPage() {
  router.push(`/add/addAgency`);
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

.agency-logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
  border-radius: 50%;
}

.agency-info {
  flex: 1;
}

.agency-info h3,
.agency-info p {
  margin: 0;
  font-size: 16px;
  color: #fff;
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

.no-results {
  text-align: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  width: 100%;
}

.no-results button {
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
  font-size: 1rem;
}

.no-results button:hover {
  background: #0056b3;
}

@media (max-width: 480px) {
  .results-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .agency-logo {
    margin-bottom: 10px;
  }

  .agency-info h3,
  .agency-info p {
    font-size: 14px;
  }

  .star {
    font-size: 18px;
  }
}
</style>
    