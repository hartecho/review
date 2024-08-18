<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find General Contractors</h1>
      <p>
        Search for general contractors by name, operating states, or star
        rating.
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

      <div class="right-panel" v-if="!loading">
        <SearchContractorResultsList
          :filteredContractors="filteredContractors"
          :searchQuery="searchQuery"
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
import { states } from "~/utils/states.js";

const store = useStore();

const searchQuery = ref("");
const selectedStates = ref([]);
const selectedRating = ref("0");
const showStateDropdown = ref(false);
const loading = ref(true); // Loading state

useSeoMeta({
  title:
    "Find General Contractors | Subsource – Search by Name, Operating States, or Rating",
  ogTitle:
    "Find General Contractors | Subsource – Search by Name, Operating States, or Rating",
  description:
    "Search for top-rated general contractors by name or operating states. Use filters to find contractors by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated general contractors by name or operating states. Use filters to find contractors by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

// Fetch and cache data for contractors
async function fetchContractorsAndCache() {
  if (
    store.contractors.length == 0 ||
    !store.lastFetchTime ||
    Date.now() - store.lastFetchTime >= store.CACHE_DURATION
  ) {
    try {
      const contractors = await $fetch("/api/contractors");
      // console.log("contractors: " + JSON.stringify(contractors));
      store.setContractors(contractors);
    } catch (error) {
      console.log("error: " + error);
    }
  }
  loading.value = false; // Set loading to false once data is fetched
}

onMounted(async () => {
  await fetchContractorsAndCache();
  emit("hide-loading"); // Notify that loading is done
});

const filteredContractors = computed(() => {
  let filtered = store.contractors;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (contractor) =>
        (contractor.company &&
          contractor.company.toLowerCase().includes(query)) ||
        contractor.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        )
    );
  }

  // Filter by selected states
  if (selectedStates.value.length) {
    filtered = filtered.filter((contractor) =>
      selectedStates.value.every((state) =>
        contractor.operatingStates.includes(state)
      )
    );
  }

  // Filter by selected rating
  if (selectedRating.value && selectedRating.value !== "0") {
    const rating = selectedRating.value;
    if (rating === "4_and_above") {
      filtered = filtered.filter(
        (contractor) => contractor.ratings !== null && contractor.ratings >= 4
      );
    } else {
      const minRating = parseInt(rating, 10);
      const maxRating = minRating + 0.999; // Allow ratings up to just below the next whole number
      filtered = filtered.filter(
        (contractor) =>
          contractor.ratings !== null &&
          contractor.ratings >= minRating &&
          contractor.ratings < maxRating
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
