<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find Subcontractors</h1>
      <p>
        Search for subcontractors by name, city, or state, and filter by job
        type and star rating.
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
          @update:selectedTags="selectedTags = $event"
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
const selectedTags = ref([]);
const selectedRating = ref(0);
const showDropdown = ref(false);

const { data: contractors } = await useFetch("/api/contractors");

const tagDescriptions = {
  FLR: "Flooring",
  CTP: "Countertops",
  CAB: "Cabinets",
  CON: "Concrete and Masonry",
  STL: "Steel and Metal Fabrication",
  FRM: "Framing",
  ROF: "Roofing",
  SID: "Siding",
  WND: "Windows and Doors",
  LND: "Landscaping and Hardscaping",
  DRY: "Drywall and Plaster",
  PNT: "Painting and Finishing",
  INS: "Insulation",
  CLG: "Ceiling Systems",
  HVAC: "HVAC",
  PLM: "Plumbing",
  ELEC: "Electrical",
  EXC: "Excavation",
  DEM: "Demolition",
  GRD: "Grading and Paving",
  FPS: "Fire Protection and Sprinkler Systems",
  SEC: "Security Systems",
  AV: "Audio-Visual Installations",
  ELEV: "Elevator and Escalator Installation",
  SOL: "Solar Energy and Green Building Solutions",
  UTIL: "Utility Contractors",
  FIN: "Finishing Contractors",
  CAR: "Carpentry and Woodwork",
  TLE: "Tile and Stone Installation",
  GLS: "Glass and Glazing",
  SPC: "Specialty Coatings and Sealants",
  REN: "Renovation and Restoration",
  HIS: "Historic Restoration",
  REM: "Remodeling",
  WTR: "Waterproofing and Mold Remediation",
  ENV: "Environmental Contractors",
  ASB: "Asbestos Abatement",
  LEAD: "Lead Paint Removal",
  ENVC: "Environmental Cleanup and Remediation",
  DB: "Design and Build Contractors",
  ARC: "Architectural Services",
  ENG: "Engineering Services",
  LOG: "Logistics and Material Handling Contractors",
  WARE: "Warehouse Setup",
  IEQ: "Industrial Equipment Installation",
  SPEQ: "Specialty Equipment Contractors",
  CKE: "Commercial Kitchen Equipment",
  LMEQ: "Laboratory and Medical Equipment",
  FAC: "Facade and Cladding Contractors",
  CUR: "Curtain Wall Systems",
  OTH: "Other",
};

const filteredContractors = computed(() => {
  let filtered = contractors.value.filter(
    (contractor) => !contractor.tags.includes("GEN")
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (contractor) =>
        (contractor.company &&
          contractor.company.toLowerCase().includes(query)) ||
        (contractor.address.city &&
          contractor.address.city.toLowerCase().includes(query)) ||
        (contractor.address.state &&
          contractor.address.state.toLowerCase().includes(query)) ||
        contractor.tags.some((tag) =>
          tagDescriptions[tag].toLowerCase().includes(query)
        )
    );
  }

  if (selectedTags.value.length) {
    filtered = filtered.filter((contractor) =>
      selectedTags.value.every((tag) => contractor.tags.includes(tag))
    );
  }

  if (selectedRating.value > 0) {
    filtered = filtered.filter(
      (contractor) => contractor.rating >= selectedRating.value
    );
  }

  return filtered;
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
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
  .page-header h1 {
    font-size: 1.5em;
  }

  .page-header p {
    font-size: 1em;
  }
}
</style>
