<template>
  <div class="wrapper">
    <div class="page-header">
      <h1>Find Subsubcontractors</h1>
      <p>
        Search for subsubcontractors by name, operating states, or job type, and
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
        <SearchSubcontractorResultsList
          :filteredSubcontractors="filteredSubcontractors"
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
    "Find Subsubcontractors | Subsource – Search by Job Type, Name, Operating States, or Rating",
  ogTitle:
    "Find Subsubcontractors | Subsource – Search by Job Type, Name, Operating States, or Rating",
  description:
    "Search for top-rated subsubcontractors by job type, name, or operating states. Use filters to find subsubcontractors by star rating and read detailed reviews on Subsource.",
  ogDescription:
    "Search for top-rated subsubcontractors by job type, name, or operating states. Use filters to find subsubcontractors by star rating and read detailed reviews on Subsource.",
  ogImage: "/SSLogo.webp",
  twitterCard: "/SSLogo.webp",
});

const { data: subcontractors } = await useFetch("/api/subcontractors");

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
  UTIL: "Utility Subcontractors",
  FIN: "Finishing Subcontractors",
  CAR: "Carpentry and Woodwork",
  TLE: "Tile and Stone Installation",
  GLS: "Glass and Glazing",
  SPC: "Specialty Coatings and Sealants",
  REN: "Renovation and Restoration",
  HIS: "Historic Restoration",
  REM: "Remodeling",
  WTR: "Waterproofing and Mold Remediation",
  ENV: "Environmental Subcontractors",
  ASB: "Asbestos Abatement",
  LEAD: "Lead Paint Removal",
  ENVC: "Environmental Cleanup and Remediation",
  DB: "Design and Build Subcontractors",
  ARC: "Architectural Services",
  ENG: "Engineering Services",
  LOG: "Logistics and Material Handling Subcontractors",
  WARE: "Warehouse Setup",
  IEQ: "Industrial Equipment Installation",
  SPEQ: "Specialty Equipment Subcontractors",
  CKE: "Commercial Kitchen Equipment",
  LMEQ: "Laboratory and Medical Equipment",
  FAC: "Facade and Cladding Subcontractors",
  CUR: "Curtain Wall Systems",
  OTH: "Other",
};

const filteredSubcontractors = computed(() => {
  let filtered = subcontractors.value.filter(
    (subcontractor) => !subcontractor.tags.includes("GEN")
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (subcontractor) =>
        (subcontractor.company &&
          subcontractor.company.toLowerCase().includes(query)) ||
        subcontractor.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        ) ||
        subcontractor.tags.some((tag) =>
          tagDescriptions[tag].toLowerCase().includes(query)
        )
    );
  }

  if (selectedTags.value.length) {
    filtered = filtered.filter((subcontractor) =>
      selectedTags.value.every((tag) => subcontractor.tags.includes(tag))
    );
  }

  if (selectedRating.value && selectedRating.value != "0") {
    const rating = selectedRating.value;
    // console.log("Rating: ", rating);
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
