<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find Agencies</h1>
      <p>
        Search for agencies by name, operating states, or job type, and filter
        by star rating.
      </p>
    </div>
    <div class="filter-page">
      <div class="left-panel">
        <SearchInput
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
        />
        <SearchStateFilter
          :showDropdown="showStateDropdown"
          :selectedStates="selectedStates"
          :states="states"
          @toggleDropdown="toggleStateDropdown"
          @closeDropdown="closeStateDropdown"
          @update:selectedStates="selectedStates = $event"
        />
        <SearchRatingFilter
          :selectedRating="selectedRating"
          @update:selectedRating="selectedRating = $event"
        />
        <button @click="resetFilters" class="reset-button">
          Reset Filters
        </button>
      </div>
      <div class="right-panel">
        <SearchAgencyResultsList
          :filteredAgencies="filteredAgencies"
          :searchQuery="searchQuery"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { states } from "/utils/states.js";

const searchQuery = ref("");
const selectedRating = ref("0");
const selectedStates = ref([]);
const showStateDropdown = ref(false);

useSeoMeta({
  title:
    "Find Commerical Agencies | Subsource – Search by Job Type, Name, Operating States, or Rating",
  ogTitle:
    "Find Commerical Agencies | Subsource – Search by Job Type, Name, Operating States, or Rating",
  description:
    "Search for top-rated commerical agencies by job type, name, or operating states. Use filters to find agencies by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated commercial agencies by job type, name, or operating states. Use filters to find agencies by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

const { data: agencies } = await useFetch("/api/agencies");

const filteredAgencies = computed(() => {
  let filtered = agencies.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (agency) =>
        (agency.company && agency.company.toLowerCase().includes(query)) ||
        agency.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        )
    );
  }

  // Filter by selected states
  if (selectedStates.value.length) {
    filtered = filtered.filter((agency) =>
      selectedStates.value.every((state) =>
        agency.operatingStates.includes(state)
      )
    );
  }

  // Filter by selected rating
  if (selectedRating.value && selectedRating.value !== "0") {
    const rating = selectedRating.value;
    if (rating === "4_and_above") {
      filtered = filtered.filter(
        (agency) => agency.ratings !== null && agency.ratings >= 4
      );
    } else {
      const minRating = parseInt(rating, 10);
      const maxRating = minRating + 0.999; // Allow ratings up to just below the next whole number
      filtered = filtered.filter(
        (agency) =>
          agency.ratings !== null &&
          agency.ratings >= minRating &&
          agency.ratings < maxRating
      );
    }
  }

  // Sort alphabetically, with non-zero ratings at the top
  filtered.sort((a, b) => {
    // Compare ratings, prioritizing non-zero ratings
    if ((a.ratings || 0) > 0 && (b.ratings || 0) === 0) {
      return -1; // a has non-zero rating, b has zero rating
    }
    if ((a.ratings || 0) === 0 && (b.ratings || 0) > 0) {
      return 1; // a has zero rating, b has non-zero rating
    }
    // If both have non-zero or zero ratings, sort alphabetically by company name
    const companyA = a.company.toLowerCase();
    const companyB = b.company.toLowerCase();
    if (companyA < companyB) return -1;
    if (companyA > companyB) return 1;
    return 0;
  });

  return filtered;
});

function toggleStateDropdown() {
  showStateDropdown.value = !showStateDropdown.value;
}

function closeStateDropdown() {
  showStateDropdown.value = false;
}

function resetFilters() {
  searchQuery.value = "";
  selectedRating.value = "0";
  selectedStates.value = [];
  showStateDropdown.value = false;
}
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

.reset-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  background-color: #0056b3;
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
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    font-size: 1.5em;
  }

  .page-header p {
    font-size: 1em;
  }
}
</style>
