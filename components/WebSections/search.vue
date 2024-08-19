<template>
  <div class="search-container">
    <h2 class="search-title">Search for a Business</h2>
    <input
      type="text"
      v-model="searchQuery"
      @focus="showList = true"
      @blur="hideList"
      @input="filterList"
      placeholder="Search for a business by name, operating states, or job types..."
      class="search-input"
    />
    <transition name="dropdown">
      <ul
        v-if="
          !loading &&
          searchQuery.length > 0 &&
          filteredBusinesses.length &&
          showList
        "
        class="dropdown-list"
      >
        <li
          v-for="business in filteredBusinesses"
          :key="business._id"
          class="dropdown-item"
          @mousedown.prevent="goToBusinessPage(business._id, business.type)"
        >
          <img :src="business.picture" alt="Picture" class="business-logo" />
          <div class="business-info">
            <h3>
              <span
                v-for="(part, index) in splitText(business.company)"
                :key="index"
                :class="{ highlight: part.match }"
              >
                {{ part.text }}
              </span>
            </h3>
            <!-- Business type label -->
            <p class="business-type">{{ capitalize(business.type) }}</p>
            <ul class="operating-states-list">
              <li v-for="state in business.operatingStates" :key="state">
                <span
                  v-for="(part, index) in splitText(state)"
                  :key="index"
                  :class="{ highlight: part.match }"
                >
                  {{ part.text }}
                </span>
              </li>
            </ul>
            <ul class="jobs-list">
              <li v-for="job in business.tags" :key="job">
                <span
                  v-for="(part, index) in splitText(tagDescriptions[job])"
                  :key="index"
                  :class="{ highlight: part.match }"
                >
                  {{ part.text }}
                </span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-else-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { tagDescriptions } from "~/utils/tagDescriptions.js";

const store = useBusinessStore();

const searchQuery = ref("");
const showList = ref(false);
const loading = ref(true); // Loading state
const router = useRouter();

// Function to fetch and set data in the store
async function fetchDataAndCache() {
  if (
    !store.lastFetchTime ||
    Date.now() - store.lastFetchTime >= store.CACHE_DURATION
  ) {
    // console.log("Data is not valid, fetching new data...");

    try {
      const contractors = await $fetch("/api/contractors");
      const subcontractors = await $fetch("/api/subcontractors");
      const suppliers = await $fetch("/api/suppliers");
      const agencies = await $fetch("/api/agencies");

      store.setContractors(contractors);
      store.setSubcontractors(subcontractors);
      store.setSuppliers(suppliers);
      store.setAgencies(agencies);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  }

  loading.value = false; // Set loading to false once data is fetched
}

onMounted(async () => {
  await fetchDataAndCache();
});

// Combine all businesses into a single list with their types
const allBusinesses = computed(() => {
  return [
    ...store.contractors.map((item) => ({ ...item, type: "contractor" })),
    ...store.subcontractors.map((item) => ({ ...item, type: "subcontractor" })),
    ...store.suppliers.map((item) => ({ ...item, type: "supplier" })),
    ...store.agencies.map((item) => ({ ...item, type: "agency" })),
  ];
});

// Filter businesses based on the search query
const filteredBusinesses = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();

  return allBusinesses.value.filter((business) => {
    const matchesCompany =
      business.company?.toLowerCase().includes(query) || false;
    const matchesStates =
      business.operatingStates?.some((state) =>
        state?.toLowerCase().includes(query)
      ) || false;
    const matchesTags =
      business.tags?.some((tag) =>
        tagDescriptions[tag]?.toLowerCase().includes(query)
      ) || false;

    return matchesCompany || matchesStates || matchesTags;
  });
});

// Utility functions for the UI
function filterList() {
  showList.value = true;
}

function hideList() {
  setTimeout(() => {
    showList.value = false;
  }, 200);
}

function goToBusinessPage(businessId, businessType) {
  router.push(`/${businessType}/${businessId}`);
}

function splitText(text) {
  const query = searchQuery.value.toLowerCase();

  if (!text || typeof text !== "string") {
    return [{ text: "", match: false }];
  }

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}

function capitalize(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 700px;
  padding: 10rem 2rem 0 2rem;
  margin: 0 auto;
  text-align: center;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.search-title {
  text-align: center;
  margin-bottom: 1rem;
  color: white;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 25px;
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
}

.dropdown-list {
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
  flex-direction: column;
  transition: scrollbar-color 0.3s ease;
}

/* Webkit-based browsers (Chrome, Safari, Edge) */
.dropdown-list::-webkit-scrollbar {
  width: 8px;
}

.dropdown-list::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dropdown-list:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}

/* Firefox */
.dropdown-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) transparent;
}

.dropdown-list:hover {
  scrollbar-color: rgba(255, 255, 255, 1) transparent;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  color: white;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.business-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.business-info {
  flex: 1;
  text-align: left;
  margin-left: 0rem;
}

.business-info h3,
.business-info p,
.business-info ul {
  margin: 0 auto;
  font-size: 16px;
  color: #fff;
}

.business-type {
  margin-top: 5px;
  font-size: 14px;
  color: #ddd;
}

.operating-states-list,
.jobs-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  /* flex-wrap: wrap; */
  justify-content: flex-start;
}

.operating-states-list li,
.jobs-list li {
  font-size: 14px;
  margin: 0 15px 0 0;
  padding: 0;
  color: #fff;
  /* max-width: 150px; */
  text-align: left;
}

.highlight {
  background-color: darkcyan;
  color: white;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: white;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .search-container {
    width: 100%;
  }

  .search-input {
    max-width: 100%;
  }

  .dropdown-list {
    left: 2rem;
    right: 2rem;
  }
}

@media (max-width: 480px) {
  .search-container {
    width: 100%;
  }

  .search-input {
    max-width: 100%;
  }

  .dropdown-item {
    align-items: flex-start;
  }

  .business-logo {
    margin-top: 5px;
  }
}
</style>
