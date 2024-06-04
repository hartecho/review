<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find General Contractors</h1>
      <p>
        Search for general contractors by name, city, or state, and filter by
        star rating.
      </p>
    </div>
    <div class="filter-page">
      <div class="left-panel">
        <div class="filter-container">
          <input
            type="text"
            v-model="searchQuery"
            @input="filterList"
            placeholder="Search general contractors by name, city, or state..."
            class="search-input"
          />
          <div class="rating-filter">
            <label for="rating">Minimum Star Rating:</label>
            <select
              id="rating"
              v-model="selectedRating"
              @change="filterList"
              class="rating-select"
            >
              <option value="0">All Ratings</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div class="results-container">
          <ul v-if="filteredContractors.length" class="results-list">
            <li
              v-for="contractor in filteredContractors"
              :key="contractor._id"
              class="results-item"
              @click="goToContractorPage(contractor._id)"
            >
              <img
                :src="contractor.picture"
                alt="Picture"
                class="contractor-logo"
              />
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
                <span
                  v-for="n in 5"
                  :key="n"
                  class="star"
                  :class="{ filled: n <= contractor.rating }"
                  >&#9733;</span
                >
              </div>
            </li>
          </ul>
          <p v-else>No general contractors found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const selectedRating = ref(0);
const router = useRouter();

const { data: contractors } = await useFetch("/api/contractors");

const tagDescriptions = {
  GEN: "General Contractors",
  // Other tag descriptions can be left here but will not be used for filtering
};

const filteredContractors = computed(() => {
  let filtered = contractors.value.filter((contractor) =>
    contractor.tags.includes("GEN")
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (contractor) =>
        (contractor.company &&
          contractor.company.toLowerCase().includes(query)) ||
        contractor.address.city.toLowerCase().includes(query) ||
        contractor.address.state.toLowerCase().includes(query)
    );
  }

  if (selectedRating.value > 0) {
    filtered = filtered.filter(
      (contractor) => contractor.rating >= selectedRating.value
    );
  }

  return filtered;
});

function filterList() {
  // The computed property will automatically update when searchQuery or selectedRating change
}

function goToContractorPage(contractorId) {
  router.push(`/contractor/${contractorId}`);
}

function splitText(text) {
  const query = searchQuery.value.toLowerCase();
  if (!query) return [{ text, match: false }];

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}

function displayJobs(tags) {
  const visibleTags = tags.slice(0, 3);
  return visibleTags.map((tag) => tagDescriptions[tag]);
}

function highlightMatch(text) {
  if (!text) return "";
  const query = searchQuery.value;
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// Handle fading scrollbar
let scrollTimeout;

const onScroll = () => {
  clearTimeout(scrollTimeout);
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) {
    resultsContainer.classList.add("scrolling");
  }

  scrollTimeout = setTimeout(() => {
    if (resultsContainer) {
      resultsContainer.classList.remove("scrolling");
    }
  }, 2000);
};

onMounted(() => {
  const resultsContainer = document.querySelector(".results-container");
  if (resultsContainer) {
    resultsContainer.addEventListener("scroll", onScroll);
  }
});
</script>

<style scoped>
.wrapper {
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  height: 100vh;
}

.page-header {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  box-shadow: 0 0 10px white;
  margin-bottom: 4rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2em;
}

.page-header p {
  margin: 10px 0 0;
  font-size: 1.2em;
}

.filter-page {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
}

.left-panel,
.right-panel {
  flex: 1;
  padding: 20px;
}

.left-panel {
  margin-top: 1rem;
}

.filter-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 600px;
  padding: 10px 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
}

.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.dropdown-button::after {
  content: "▼";
  font-size: 12px;
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  transition: scrollbar-color 0.3s ease;
}

/* Webkit-based browsers (Chrome, Safari, Edge) */
.dropdown-menu::-webkit-scrollbar {
  width: 8px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dropdown-menu.scrolling::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* Firefox */
.dropdown-menu {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.dropdown-menu.scrolling {
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.dropdown-item {
  flex: 1 0 45%;
  margin: 5px;
  color: white;
}

.rating-filter {
  margin-top: 10px;
}

.rating-select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 25px;
}

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
}

.star {
  font-size: 20px;
  color: #ccc;
}

.star.filled {
  color: #ffd700;
}

@media (max-width: 768px) {
  .filter-page {
    flex-direction: column;
  }

  .left-panel,
  .right-panel {
    width: 100%;
    padding: 10px;
  }

  .search-input {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.5em;
  }

  .page-header p {
    font-size: 1em;
  }

  .filter-container {
    align-items: center;
    width: 100%;
  }

  .dropdown-button {
    padding: 10px;
  }

  .rating-filter {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .rating-select {
    width: 100%;
    margin-top: 10px;
  }

  .results-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .contractor-logo {
    margin-bottom: 10px;
  }
}
</style>
