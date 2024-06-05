<template>
  <div class="profile-page">
    <section class="profile-header-section">
      <div class="profile-header">
        <div class="profile-left-column">
          <div class="profile-image">
            <img :src="resolvedImgPath()" alt="Contractor Picture" />
          </div>
          <div class="job-types-section">
            <div class="subtitle">
              <h2>Job Types</h2>
              <div class="gray-line"></div>
            </div>
            <ul class="job-types">
              <li v-for="tag in contractor.tags" :key="tag">
                {{ tagDescriptions[tag] }}
              </li>
            </ul>
          </div>
        </div>
        <div class="profile-right-column">
          <div class="company">
            <h1>{{ contractor.company }}</h1>
            <h6 v-if="isBusinessOwner">(You are the owner of this business)</h6>
          </div>
          <p class="location">
            {{ contractor.address.city }}, {{ contractor.address.state }}
          </p>
          <div class="ratings-section">
            <h2>Ratings</h2>
            <div class="rating-row">
              <p class="star-rating">{{ roundedRating.toFixed(1) }}</p>
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star">
                  {{ n <= roundedRating ? "★" : "☆" }}
                </span>
              </div>
            </div>
          </div>
          <div class="actions">
            <button
              class="contact-contractor-button"
              @click="contactContractor"
            >
              Contact Contractor
            </button>
            <button class="report-button">Report an Issue</button>
          </div>
          <div class="tabs">
            <button
              @click="activeTab = 'about'"
              :class="{ active: activeTab === 'about' }"
            >
              About
            </button>
            <button
              @click="activeTab = 'reviews'"
              :class="{ active: activeTab === 'reviews' }"
            >
              Leave a Review
            </button>
          </div>
          <div class="tab-content" v-if="activeTab === 'about'">
            <h3>Contact Information</h3>
            <div class="contact-info">
              <p><strong>Email:</strong> {{ contractor.email }}</p>
              <p><strong>Phone:</strong> {{ contractor.phone }}</p>
              <p>
                <strong>Address:</strong> {{ contractor.address.city }},
                {{ contractor.address.state }}
              </p>
            </div>
          </div>
          <div class="tab-content" v-if="activeTab === 'reviews'">
            <ReviewForm
              :contractor="contractor"
              :tagDescriptions="tagDescriptions"
              :isBusinessOwner="isBusinessOwner"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="reviews-section">
      <Reviews
        :contractor="contractor"
        :tagDescriptions="tagDescriptions"
        :isBusinessOwner="isBusinessOwner"
      />
    </section>

    <div :class="['modal-wrapper', { 'is-visible': showLoginModal }]">
      <LoginModal @close="closeLoginModal" />
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const store = useStore();

const { data: contractor } = await useFetch(
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
  return store.user && store.user.contractor === contractor.value._id;
});
</script>


<style scoped>
.profile-page {
}

.profile-header-section {
  background: url("/BG2.jpg") no-repeat center top;
  background-size: cover;
  font-family: Arial, sans-serif;
  color: white;
  width: 100%;
  padding: 2rem 2rem 5rem 2rem;
  min-height: 55rem;
}

.profile-header-section,
.review-form-section,
.reviews-section {
  margin-bottom: 40px;
}

.profile-header {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
}

.profile-left-column {
  width: 25%;
  padding-right: 20px;
}

.profile-right-column {
  width: 75%;
  padding-left: 40px;
}

.company {
  display: flex;
  gap: 2rem;
  margin: 3rem 0 10px 0;
}

.profile-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.job-types-section {
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem;
  border-radius: 10px;
}

.subtitle {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: black;
}

h2 {
  margin-bottom: 1rem;
  font-size: 18px;
  font-weight: normal;
  color: black;
}

h3 {
  color: black;
  margin-bottom: 1rem;
}

h6 {
  color: white;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px black;
  margin-bottom: 1rem;
}

.gray-line {
  border-bottom: 1px solid black;
  height: 1px;
  flex-grow: 1;
  margin-left: 10px;
}

.job-types {
  list-style: none;
  padding: 0;
  font-weight: bold;
}

.job-types li {
  margin-bottom: 10px;
  font-size: 16px;
  color: black;
}

.profile-right-column h1 {
  font-size: 32px;
  color: white;
  text-shadow: 2px 2px 2px black;
}

.profile-right-column .location {
  font-size: 20px;
  color: white;
  text-shadow: 1px 1px 2px black;
  margin-bottom: 30px;
}

.ratings-section {
  margin-bottom: 40px;
}

.ratings-section h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: normal;
  color: white;
  text-shadow: 1px 1px 2px black;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.rating-row .star-rating {
  font-size: 36px;
  color: white;
  text-shadow: 1px 1px 2px black;
}

.stars {
  display: flex;
}

.star {
  color: #ff9900;
  font-size: 60px;
  text-shadow: 2px 2px 5px black;
}

.actions {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.contact-contractor-button,
.report-button {
  background-color: #007bff;
  color: white;
  text-shadow: 1px 1px 2px black;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.contact-contractor-button:hover,
.report-button:hover {
  background-color: #0056b3;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
  color: white;
  text-shadow: 2px 2px 1px black;
  transition: color 0.3s, border-bottom 0.3s;
}

.tabs button:hover {
  color: white;
  text-shadow: 1px 1px 2px black;
}

.tabs button.active {
  border-bottom: 2px solid white;
  font-weight: bold;
}

.tab-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.contact-info p {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
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
