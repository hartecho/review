<template>
  <div class="wrapper">
    <div class="filter-page">
      <div class="left-panel">
        <div class="filter-container">
          <input
            type="text"
            v-model="searchQuery"
            @input="filterList"
            placeholder="Search contractors..."
            class="search-input"
          />
          <div class="dropdown">
            <button @click="toggleDropdown" class="dropdown-button">
              Select Job Types
            </button>
            <div v-if="showDropdown" class="dropdown-menu">
              <div
                v-for="(description, tag) in sortedTagDescriptions"
                :key="tag"
                class="dropdown-item"
              >
                <input
                  type="checkbox"
                  :id="tag"
                  :value="tag"
                  v-model="selectedTags"
                  @change="filterList"
                />
                <label :for="tag">{{ description }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div class="results-container">
          <ul v-if="filteredContractors.length" class="results-list">
            <li
              v-for="contractor in filteredContractors"
              :key="contractor._id"
              class="results-item"
              @click="goToContractorPage(contractor._id)"
            >
              <img
                :src="contractor.picture"
                alt="Picture"
                class="contractor-logo"
              />
              <div class="contractor-info">
                <h3>
                  <span
                    v-for="(part, index) in splitText(contractor.company)"
                    :key="index"
                    :class="{ highlight: part.match }"
                  >
                    {{ part.text }}
                  </span>
                </h3>
                <p>
                  <span
                    v-for="(part, index) in splitText(
                      `${contractor.address.city}, ${contractor.address.state}`
                    )"
                    :key="index"
                    :class="{ highlight: part.match }"
                  >
                    {{ part.text }}
                  </span>
                </p>
                <ul class="jobs-list">
                  <li
                    v-for="(job, index) in displayJobs(contractor.tags)"
                    :key="index"
                    v-html="highlightMatch(job)"
                  ></li>
                  <li v-if="contractor.tags.length > 3">...</li>
                </ul>
              </div>
            </li>
          </ul>
          <p v-else>No contractors found.</p>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const selectedTags = ref([]);
const showDropdown = ref(false);
const router = useRouter();

const { data: contractors } = await useFetch("/api/contractors");

const tagDescriptions = {
  GEN: "General Contractors",
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

const sortedTagDescriptions = computed(() => {
  return Object.keys(tagDescriptions)
    .sort((a, b) => tagDescriptions[a].localeCompare(tagDescriptions[b]))
    .reduce((sorted, key) => {
      sorted[key] = tagDescriptions[key];
      return sorted;
    }, {});
});

const filteredContractors = computed(() => {
  let filtered = contractors.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (contractor) =>
        (contractor.company &&
          contractor.company
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())) ||
        contractor.tags.some((tag) =>
          tagDescriptions[tag]
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        )
    );
  }

  if (selectedTags.value.length) {
    filtered = filtered.filter((contractor) =>
      selectedTags.value.every((tag) => contractor.tags.includes(tag))
    );
  }

  return filtered;
});

function filterList() {
  // The computed property will automatically update when searchQuery or selectedTags change
}

function goToContractorPage(contractorId) {
  router.push(`/contractor/${contractorId}`);
}

function splitText(text) {
  const query = searchQuery.value.toLowerCase();
  if (!query) return [{ text, match: false }];

  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === query,
  }));
}

function displayJobs(tags) {
  const visibleTags = tags.slice(0, 3);
  return visibleTags.map((tag) => tagDescriptions[tag]);
}

function highlightMatch(text) {
  if (!text) return "";
  const query = searchQuery.value;
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}
</script>
  
  <style scoped>
.wrapper {
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  height: 45rem;
}

.filter-page {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
}

.left-panel {
  flex: 1;
  padding: 20px;
}

.right-panel {
  flex: 2;
  padding: 20px;
}

.filter-container {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-bottom: 20px;
}

.search-input {
  width: 300px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.dropdown {
  position: relative;
}

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  width: 400px;
}

.dropdown-item {
  flex: 1 0 45%;
  margin: 5px;
  color: white;
}

.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.results-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
}

.results-item:last-child {
  border-bottom: none;
}

.contractor-logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.contractor-info {
  flex: 1;
}

.contractor-info h3,
.contractor-info p {
  margin: 0;
  font-size: 14px;
}

.jobs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.jobs-list li {
  font-size: 12px;
  display: inline;
  margin-right: 5px;
}

.highlight {
  background-color: darkcyan;
  color: white;
}
</style>
  