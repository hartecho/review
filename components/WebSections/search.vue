<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      @focus="showList = true"
      @blur="hideList"
      @input="filterList"
      placeholder="Search contractors..."
      class="search-input"
    />
    <transition name="dropdown">
      <ul
        v-if="searchQuery.length > 0 && filteredContractors.length && showList"
        class="dropdown-list"
      >
        <li
          v-for="contractor in filteredContractors"
          :key="contractor._id"
          class="dropdown-item"
          @mousedown.prevent="goToContractorPage(contractor._id)"
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
            {{ contractor.address.city }}, {{ contractor.address.state }}
            <ul class="jobs-list">
              <li v-for="job in contractor.tags" :key="job">
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
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const showList = ref(false);
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

const filteredContractors = computed(() => {
  if (!searchQuery.value) return [];
  return contractors.value.filter(
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
});

function filterList() {
  showList.value = true;
}

function hideList() {
  setTimeout(() => {
    showList.value = false;
  }, 200);
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
</script>

<style scoped>
.search-container {
  position: relative;
  width: 400px;
  margin: 0 auto;
  text-align: center;
  color: black;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter, .dropdown-leave-to /* .dropdown-leave-active in <2.1.8 */ {
  max-height: 0;
  opacity: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.contractor-logo {
  width: 40px;
  height: 40px;
  margin-right: 8px;
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
}

.highlight {
  background-color: darkcyan;
  color: white;
}
</style>
