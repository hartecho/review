<template>
  <div class="profile-page">
    <section class="header-section">
      <ProfileHeaderSection
        :contractor="contractor"
        :tagDescriptions="tagDescriptions"
        :contactContractor="contactContractor"
        :roundedRating="roundedRating"
      />
    </section>
    <section class="tabs-section">
      <ProfileTabsSection
        :contractor="contractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :isPro="isPro"
      />
    </section>
    <section class="reviews-section">
      <ReviewReviewsSection
        :contractor="contractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
        :isPro="isPro"
      />
    </section>
    <div :class="['modal-wrapper', { 'is-visible': showLoginModal }]">
      <NavFooterPreloadLoginModal @close="closeLoginModal" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const store = useStore();

const { data: contractor, pending: contractorPending } = await useFetch(
  `/api/contractors?_id=${route.params.id}`
);

const tagDescriptions = {
  GEN: "General Contractor",
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

const showLoginModal = ref(false);
const activeTab = ref("reviews");

const resolvedImgPath = () => {
  return `/${contractor.value.picture}`;
};

const contactContractor = () => {
  alert(`Contacting ${contractor.value.company}`);
};

const openLoginModal = () => {
  showLoginModal.value = true;
  document.body.classList.add("no-scroll");
};

const closeLoginModal = () => {
  showLoginModal.value = false;
  document.body.classList.remove("no-scroll");
};

const roundedRating = computed(() => {
  return Math.round(contractor.value.ratings);
});

const isBusinessOwner = computed(() => {
  if (!store.user || !contractor.value) {
    return false;
  }
  const isOwner = store.user.contractor === contractor.value._id;
  return isOwner;
});

const isPro = computed(() => {
  return true;
});
</script>

<style scoped>
.profile-page {
}

.header-section {
  min-height: 25rem;
  height: 25rem;
  width: 100%;
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  position: relative;
}

.tabs-section {
}

.reviews-section {
  margin-top: 20px;
  /* background: url("/IntroBG.jpg") no-repeat center top; */
  /* background: black; */
  background-size: cover;
}

.modal-wrapper {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.modal-wrapper.is-visible {
  visibility: visible;
  opacity: 1;
}
</style>
