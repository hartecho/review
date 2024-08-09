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
        <SearchJobTypeDropdown
          :showDropdown="showDropdown"
          :selectedTags="selectedTags"
          :tagDescriptions="tagDescriptions"
          @toggleDropdown="toggleDropdown"
          @closeDropdown="closeDropdown"
          @update:selectedTags="selectedTags = $event"
        />
        <SearchRatingFilter
          :selectedRating="selectedRating"
          @update:selectedRating="selectedRating = $event"
        />
      </div>
      <div class="right-panel">
        <SearchAgencyResultsList
          :filteredAgencies="filteredAgencies"
          :searchQuery="searchQuery"
          :tagDescriptions="tagDescriptions"
        />
      </div>
    </div>
  </div>
</template>
    
    <script setup>
const searchQuery = ref("");
const selectedTags = ref([]);
const selectedRating = ref("0");
const showDropdown = ref(false);

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

const tagDescriptions = {
  // Skilled Trades
  CARP: "Carpentry",
  ELEC: "Electrical",
  PLUM: "Plumbing",
  HVAC: "HVAC Technician",
  MASN: "Masonry",
  ROOF: "Roofing",
  PAIN: "Painting",
  TILE: "Tile Setting",
  PLST: "Plastering",
  FRAM: "Framing",
  INSL: "Insulation",
  WELD: "Welding",
  MILL: "Millwork",
  // General Labor
  LABR: "General Laborer",
  DEMO: "Demolition Worker",
  FORK: "Forklift Operator",
  EQUI: "Equipment Operator",
  // Administrative and Professional
  ADMN: "Administrative Assistant",
  ACCT: "Accountant",
  PMGR: "Project Manager",
  QACO: "Quality Control Specialist",
  SAFM: "Safety Manager",
  SUPR: "Site Supervisor",
  // Technical and IT
  DRFT: "Drafter",
  ENGI: "Engineer",
  ARCH: "Architect",
  ITSP: "IT Support Technician",
  NETW: "Network Engineer",
  // Specialized Roles
  SURV: "Surveyor",
  LAND: "Landscape Designer",
  ENVG: "Environmental Engineer",
  LOGI: "Logistics Coordinator",
  SECW: "Security Personnel",
  // Sales and Customer Service
  SALE: "Sales Representative",
  CUST: "Customer Service Representative",
  // Health and Safety
  SAFI: "Safety Inspector",
  FIRW: "Fire Safety Specialist",
  // Other
  OTH: "Other",
};

const filteredAgencies = computed(() => {
  let filtered = agencies.value.filter(
    (agency) => !agency.tags.includes("GEN")
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (agency) =>
        (agency.company && agency.company.toLowerCase().includes(query)) ||
        agency.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        ) ||
        agency.tags.some((tag) =>
          tagDescriptions[tag].toLowerCase().includes(query)
        )
    );
  }

  if (selectedTags && selectedTags.value && selectedTags.value.length) {
    filtered = filtered.filter((agency) =>
      selectedTags.value.every((tag) => agency.tags.includes(tag))
    );
  }

  if (selectedRating.value && selectedRating.value != "0") {
    const rating = selectedRating.value;
    // console.log("Rating: ", rating);
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

  return filtered;
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
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
    