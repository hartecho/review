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
          :selectedFirstTags="selectedRoughInTags"
          :selectedSecondTags="selectedFinishTags"
          :selectedThirdTags="selectedGeneralTags"
          :firstTagDescriptions="roughInSupplierTagDescriptions"
          :secondTagDescriptions="finishSupplierTagDescriptions"
          :thirdTagDescriptions="generalSupplierTagDescriptions"
          firstSectionLabel="Rough-In Supplies"
          secondSectionLabel="Finish Supplies"
          thirdSectionLabel="General Supplies"
          @toggleDropdown="toggleJobDropdown"
          @closeDropdown="closeJobDropdown"
          @update:selectedFirstTags="selectedRoughInTags = $event"
          @update:selectedSecondTags="selectedFinishTags = $event"
          @update:selectedThirdTags="selectedGeneralTags = $event"
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
        <SearchSupplierResultsList
          :filteredSuppliers="filteredSuppliers"
          :searchQuery="searchQuery"
          :tagDescriptions="supplierTagDescriptions"
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
import {
  supplierTagDescriptions,
  roughInSupplierTagDescriptions,
  finishSupplierTagDescriptions,
  generalSupplierTagDescriptions,
} from "~/utils/tagDescriptions.js";
import { states } from "~/utils/states.js";

const store = useBusinessStore();

const searchQuery = ref("");
const selectedRoughInTags = ref([]);
const selectedFinishTags = ref([]);
const selectedGeneralTags = ref([]);
const selectedStates = ref([]);
const selectedRating = ref("0");
const showJobDropdown = ref(false);
const showStateDropdown = ref(false);
const loading = ref(true); // Loading state

useSeoMeta({
  title:
    "Find Commercial Suppliers | Subsource – Search by Job Type, Name, Operating States, or Rating",
  ogTitle:
    "Find Commercial Suppliers | Subsource – Search by Job Type, Name, Operating States, or Rating",
  description:
    "Search for top-rated commercial suppliers by job type, name, or operating states. Use filters to find suppliers by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated commercial suppliers by job type, name, or operating states. Use filters to find suppliers by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

// Fetch and cache data for suppliers
async function fetchSuppliersAndCache() {
  if (
    store.suppliers.length === 0 ||
    !store.lastFetchTime ||
    Date.now() - store.lastFetchTime >= store.CACHE_DURATION
  ) {
    try {
      const suppliers = await $fetch("/api/suppliers");
      store.setSuppliers(suppliers);
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    }
  }
  loading.value = false; // Set loading to false once data is fetched
}

onMounted(async () => {
  await fetchSuppliersAndCache();
  emit("hide-loading"); // Notify that loading is done
});

const filteredSuppliers = computed(() => {
  let filtered = store.suppliers;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (supplier) =>
        (supplier.company && supplier.company.toLowerCase().includes(query)) ||
        supplier.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        ) ||
        supplier.tags.some(
          (tag) =>
            roughInSupplierTagDescriptions[tag]
              ?.toLowerCase()
              .includes(query) ||
            finishSupplierTagDescriptions[tag]?.toLowerCase().includes(query)
        )
    );
  }

  // Filter by selected rough-in tags
  if (selectedRoughInTags.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedRoughInTags.value.every((tag) => supplier.tags.includes(tag))
    );
  }

  // Filter by selected finish tags
  if (selectedFinishTags.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedFinishTags.value.every((tag) => supplier.tags.includes(tag))
    );
  }

  // Filter by selected finish tags
  if (selectedGeneralTags.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedGeneralTags.value.every((tag) => supplier.tags.includes(tag))
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
  selectedRoughInTags.value = [];
  selectedFinishTags.value = [];
  selectedStates.value = [];
  selectedRating.value = "0";
  showJobDropdown.value = false;
  showStateDropdown.value = false;
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.wrapper {
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  min-height: 90vh;
  padding-bottom: 2rem;
}

.page-header {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.9);
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
