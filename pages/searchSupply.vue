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
const searchQuery = ref("");
const selectedTags = ref([]);
const selectedRating = ref("0");
const showDropdown = ref(false);

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

const tagDescriptions = {
  CAB: "Cabinets",
  CKE: "Commercial Kitchen Equipment",
  LMEQ: "Laboratory and Medical Equipment",
  LOG: "Logistics and Material Handling",
  SPEQ: "Specialty Equipment Contractors",
  WARE: "Warehouse Setup",
  ACOUST: "Acoustic Materials",
  AGG: "Aggregate Suppliers",
  BRK: "Brick Suppliers",
  CMP: "Concrete Materials and Ready-Mix Suppliers",
  DRY: "Drywall and Plaster Materials",
  ELE: "Electrical Supplies and Equipment",
  ENG: "Engineered Wood Products",
  FRM: "Formwork and Shuttering Materials",
  GLAS: "Glass and Mirror Suppliers",
  HRDW: "Hardware and Fasteners",
  INSUL: "Insulation Materials",
  LUM: "Lumber and Wood Suppliers",
  MTL: "Metal and Steel Suppliers",
  PAIN: "Paint and Coatings Suppliers",
  PLMB: "Plumbing Supplies and Fixtures",
  RFMS: "Roofing Materials",
  SAF: "Safety Equipment and PPE Suppliers",
  SAND: "Sand and Gravel Suppliers",
  STON: "Stone and Tile Suppliers",
  SURF: "Surface Preparation and Coatings",
  TOOLS: "Tools and Equipment Rental",
  WALL: "Wall Systems and Panels",
  WNDW: "Window and Door Suppliers",
  HVACS: "HVAC Supplies and Equipment",
  PLST: "Plastic and Composite Materials",
  ENV: "Environmental and Erosion Control Suppliers",
  LGT: "Lighting Fixtures and Supplies",
  CABL: "Cabling and Networking Supplies",
  FURN: "Furniture and Fixtures Suppliers",
  CONV: "Construction Vehicles and Equipment Rental",
  GRDN: "Gardening and Landscaping Supplies",
  MAR: "Marble and Granite Suppliers",
  SEAL: "Sealants and Adhesives",
  TAP: "Tapes and Adhesives",
  TEMP: "Temporary Fencing and Barricades",
  WTRS: "Water Supply and Drainage Systems",
  CNTN: "Containers and Storage Solutions",
  CNVY: "Conveyors and Lifting Equipment",
  FAB: "Fabrication and Welding Supplies",
  OTH: "Other",
};

const filteredSuppliers = computed(() => {
  let filtered = suppliers.value.filter(
    (supplier) => !supplier.tags.includes("GEN")
  );

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (supplier) =>
        (supplier.company && supplier.company.toLowerCase().includes(query)) ||
        supplier.operatingStates.some((state) =>
          state.toLowerCase().includes(query)
        ) ||
        supplier.tags.some((tag) =>
          tagDescriptions[tag].toLowerCase().includes(query)
        )
    );
  }

  if (selectedTags && selectedTags.value && selectedTags.value.length) {
    filtered = filtered.filter((supplier) =>
      selectedTags.value.every((tag) => supplier.tags.includes(tag))
    );
  }

  if (selectedRating.value && selectedRating.value != "0") {
    const rating = selectedRating.value;
    // console.log("Rating: ", rating);
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
  