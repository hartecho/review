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
        <SearchInput
          :searchQuery="searchQuery"
          @update:searchQuery="searchQuery = $event"
        />
        <SearchRatingFilter
          :selectedRating="selectedRating"
          @update:selectedRating="selectedRating = $event"
        />
      </div>
      <div class="right-panel">
        <SearchResultsList
          :filteredContractors="filteredContractors"
          :searchQuery="searchQuery"
          :tagDescriptions="tagDescriptions"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref("");
const selectedRating = ref(0);

const { data: contractors } = await useFetch("/api/contractors");

const tagDescriptions = {
  GEN: "General Contractor",
  // Add other tag descriptions if necessary
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
