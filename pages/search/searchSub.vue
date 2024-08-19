<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find Subcontractors</h1>
      <p>
        Search for subcontractors by name, operating states, or job type, and
        filter by star rating.
      </p>
    </div>
    <div class="filter-page">
      <div class="left-panel">
        <SearchInput
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
        />
        <SearchJobTypeDropdown
          :showDropdown="showJobDropdown"
          :selectedTags="selectedTags"
          :tagDescriptions="tagDescriptions"
          @toggleDropdown="toggleJobDropdown"
          @closeDropdown="closeJobDropdown"
          @update:selectedTags="selectedTags = $event"
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
        <!-- New Filter for Group vs. Individual -->
        <div class="individual-group-filter">
          <label>
            <input
              type="checkbox"
              v-model="showIndividuals"
              @change="handleIndividualChange"
            />
            Show Individuals Only
          </label>
          <label>
            <input
              type="checkbox"
              v-model="showGroups"
              @change="handleGroupChange"
            />
            Show Groups Only
          </label>
        </div>
        <button @click="resetFilters" class="reset-button">
          Reset Filters
        </button>
      </div>

      <div class="right-panel" v-if="!loading">
        <SearchSubcontractorResultsList
          :filteredSubcontractors="filteredSubcontractors"
          :searchQuery="searchQuery"
          :tagDescriptions="tagDescriptions"
        />
      </div>
      <div v-else class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "~/stores/store"; // Adjust the path if necessary
import { tagDescriptions } from "~/utils/tagDescriptions.js";
import { states } from "~/utils/states.js";

const store = useStore();

const searchQuery = ref("");
const selectedTags = ref([]);
const selectedStates = ref([]);
const selectedRating = ref("0");
const showJobDropdown = ref(false);
const showStateDropdown = ref(false);
const showIndividuals = ref(false); // New state for individual filter
const showGroups = ref(false); // New state for group filter
const loading = ref(true); // Loading state

useSeoMeta({
  title:
    "Find Subcontractors | Subsource – Search by Job Type, Name, Operating States, or Rating",
  ogTitle:
    "Find Subcontractors | Subsource – Search by Job Type, Name, Operating States, or Rating",
  description:
    "Search for top-rated subcontractors by job type, name, or operating states. Use filters to find subcontractors by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated subcontractors by job type, name, or operating states. Use filters to find subcontractors by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

// Fetch and cache data for subcontractors
async function fetchSubcontractorsAndCache() {
  if (
    store.subcontractors.length === 0 ||
    !store.lastFetchTime ||
    Date.now() - store.lastFetchTime >= store.CACHE_DURATION
  ) {
    try {
      const subcontractors = await $fetch("/api/subcontractors");
      store.setSubcontractors(subcontractors);
    } catch (error) {
      console.error("Error fetching subcontractors:", error);
    }
  }
  loading.value = false; // Set loading to false once data is fetched
}

onMounted(async () => {
  await fetchSubcontractorsAndCache();
  emit("hide-loading"); // Notify that loading is done
});

const filteredSubcontractors = computed(() => {
  let filtered = store.subcontractors.filter(
    (subcontractor) => !subcontractor.tags.includes("GEN")
  );

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (subcontractor) =>
        (subcontractor.company &&
          subcontractor.company.toLowerCase().includes(query)) ||
        subcontractor.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        )
    );
  }

  // Filter by selected tags
  if (selectedTags.value.length) {
    filtered = filtered.filter((subcontractor) =>
      selectedTags.value.every((tag) => subcontractor.tags.includes(tag))
    );
  }

  // Filter by selected states
  if (selectedStates.value.length) {
    filtered = filtered.filter((subcontractor) =>
      selectedStates.value.every((state) =>
        subcontractor.operatingStates.includes(state)
      )
    );
  }

  // Filter by selected rating
  if (selectedRating.value && selectedRating.value !== "0") {
    const rating = selectedRating.value;
    if (rating === "4_and_above") {
      filtered = filtered.filter(
        (subcontractor) =>
          subcontractor.ratings !== null && subcontractor.ratings >= 4
      );
    } else {
      const minRating = parseInt(rating, 10);
      const maxRating = minRating + 0.999; // Allow ratings up to just below the next whole number
      filtered = filtered.filter(
        (subcontractor) =>
          subcontractor.ratings !== null &&
          subcontractor.ratings >= minRating &&
          subcontractor.ratings < maxRating
      );
    }
  }

  // Filter by individual or group
  if (showIndividuals.value) {
    filtered = filtered.filter((subcontractor) => subcontractor.isIndividual);
  } else if (showGroups.value) {
    filtered = filtered.filter((subcontractor) => !subcontractor.isIndividual);
  }

  // Sort alphabetically, with non-zero ratings at the top
  filtered.sort((a, b) => {
    if ((a.ratings || 0) > 0 && (b.ratings || 0) === 0) {
      return -1; // a has non-zero rating, b has zero rating
    }
    if ((a.ratings || 0) === 0 && (b.ratings || 0) > 0) {
      return 1; // a has zero rating, b has non-zero rating
    }
    const companyA = a.company.toLowerCase();
    const companyB = b.company.toLowerCase();
    if (companyA < companyB) return -1;
    if (companyA > companyB) return 1;
    return 0;
  });

  return filtered;
});

function handleIndividualChange() {
  if (showIndividuals.value) {
    showGroups.value = false; // Uncheck the group checkbox if individuals are selected
  }
}

function handleGroupChange() {
  if (showGroups.value) {
    showIndividuals.value = false; // Uncheck the individual checkbox if groups are selected
  }
}

function toggleJobDropdown() {
  showJobDropdown.value = !showJobDropdown.value;
}

function closeJobDropdown() {
  showJobDropdown.value = false;
}

function toggleStateDropdown() {
  showStateDropdown.value = !showStateDropdown.value;
}

function closeStateDropdown() {
  showStateDropdown.value = false;
}

function resetFilters() {
  searchQuery.value = "";
  selectedTags.value = [];
  selectedStates.value = [];
  selectedRating.value = "0";
  showJobDropdown.value = false;
  showStateDropdown.value = false;
  showIndividuals.value = false; // Reset the individual filter
  showGroups.value = false; // Reset the group filter
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
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

.individual-group-filter {
  margin-top: 10px;
}

label {
  color: white;
  margin-left: 0.5rem;
  margin-bottom: 1rem;
}

.individual-group-filter label {
  display: block;
  margin-bottom: 0.5rem;
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

.loading-spinner {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 1);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border-left-color: white;
  animation: spin 1s ease infinite;
  margin-top: 2rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

  .loading-spinner {
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
