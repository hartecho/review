<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find Suppliers</h1>
      <p>
        Search for suppliers by name, operating states, or job type, and filter
        by star rating.
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
          :tagDescriptions="supplierTagDescriptions"
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
        <button @click="resetFilters" class="reset-button">
          Reset Filters
        </button>
      </div>
      <div class="right-panel">
        <SearchSupplierResultsList
          :filteredSuppliers="filteredSuppliers"
          :searchQuery="searchQuery"
          :tagDescriptions="tagDescriptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { supplierTagDescriptions } from "/utils/tagDescriptions.js";
import { states } from "/utils/states.js";

const searchQuery = ref("");
const selectedTags = ref([]);
const selectedStates = ref([]);
const selectedRating = ref("0");
const showJobDropdown = ref(false);
const showStateDropdown = ref(false);

useSeoMeta({
  title:
    "Find Commerical Suppliers | Subsource – Search by Job Type, Name, Operating States, or Rating",
  ogTitle:
    "Find Commerical Suppliers | Subsource – Search by Job Type, Name, Operating States, or Rating",
  description:
    "Search for top-rated commerical suppliers by job type, name, or operating states. Use filters to find suppliers by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated commercial suppliers by job type, name, or operating states. Use filters to find suppliers by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

const { data: suppliers } = await useFetch("/api/suppliers");

const filteredSuppliers = computed(() => {
  let filtered = suppliers.value.filter(
    (supplier) => !supplier.tags.includes("GEN")
  );

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (supplier) =>
        (supplier.company && supplier.company.toLowerCase().includes(query)) ||
        supplier.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        ) ||
        supplier.tags.some((tag) =>
          supplierTagDescriptions[tag].toLowerCase().includes(query)
        )
    );
  }

  // Filter by selected tags
  if (selectedTags && selectedTags.value && selectedTags.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedTags.value.every((tag) => supplier.tags.includes(tag))
    );
  }

  // Filter by selected states
  if (selectedStates.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedStates.value.every((state) =>
        supplier.operatingStates.includes(state)
      )
    );
  }

  // Filter by selected rating
  if (selectedRating.value && selectedRating.value !== "0") {
    const rating = selectedRating.value;
    if (rating === "4_and_above") {
      filtered = filtered.filter(
        (supplier) => supplier.ratings !== null && supplier.ratings >= 4
      );
    } else {
      const minRating = parseInt(rating, 10);
      const maxRating = minRating + 0.999; // Allow ratings up to just below the next whole number
      filtered = filtered.filter(
        (supplier) =>
          supplier.ratings !== null &&
          supplier.ratings >= minRating &&
          supplier.ratings < maxRating
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
