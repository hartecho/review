<template>
  <div class="wrapper">
    <section class="item-wrapper point-bot">
      <div class="item-container">
        <div class="left-column">
          <div class="img-wrapper">
            <img :src="resolvedImgPath()" alt="Contractor Picture" />
          </div>
        </div>
        <div class="right-column" v-if="contractor">
          <h1>{{ contractor.company }}</h1>
          <p class="preview">{{ contractor.email }}</p>
          <p class="preview">{{ contractor.phone }}</p>
          <p class="preview">
            {{ contractor.address.city }}, {{ contractor.address.state }}
          </p>
          <button class="honey-button" @click="contactContractor">
            Contact Contractor
          </button>
          <p class="description">Types of Jobs:</p>
          <ul class="job-types">
            <li v-for="tag in contractor.tags" :key="tag">
              {{ getTagDescription(tag) }}
            </li>
          </ul>
          <p class="description">Ratings: {{ contractor.ratings }}</p>
        </div>
      </div>
    </section>
    <section class="reviews-section">
      <h2>Reviews</h2>
      <div
        class="review"
        v-for="review in contractor.reviews"
        :key="review._id"
      >
        <h3>{{ review.reviewer }}</h3>
        <p class="rating">Rating: {{ review.rating }} / 5</p>
        <p class="comment">{{ review.comment }}</p>
        <p class="date">{{ new Date(review.date).toLocaleDateString() }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const contractor = ref({
  company: "Doe Construction",
  email: "johndoe@example.com",
  phone: "555-1234",
  address: {
    city: "Anytown",
    state: "CA",
  },
  tags: ["GEN", "FLR", "CTP"],
  ratings: 4.5,
  picture: "HARTECHOLogo.webp",
  reviews: [
    {
      _id: "1",
      reviewer: "Alice Johnson",
      rating: 5,
      comment: "Excellent work! Highly recommend.",
      date: "2023-01-15",
    },
    {
      _id: "2",
      reviewer: "Bob Smith",
      rating: 4,
      comment: "Great job, but a bit pricey.",
      date: "2023-02-10",
    },
    {
      _id: "3",
      reviewer: "Charlie Brown",
      rating: 3,
      comment: "Average experience, nothing special.",
      date: "2023-03-05",
    },
  ],
});

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

function getTagDescription(tag) {
  return tagDescriptions[tag] || tag;
}

function resolvedImgPath() {
  return `/${contractor.value.picture}`;
}

const contactContractor = () => {
  alert(`Contacting ${contractor.value.company}`);
};
</script>

<style scoped>
.wrapper {
  background: url("/IntroBG.jpg") no-repeat center top;
  background-size: cover;
  padding: 2rem;
  color: #f1b55c;
  font-family: Bebas Neue, cursive;
}

.item-wrapper {
  background-size: cover;
  color: #f1b55c;
}

.item-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  box-shadow: 0 0 10px white;
}

.left-column,
.right-column {
  width: 45%;
}

.img-wrapper {
  width: 100%;
  height: auto;
  overflow: hidden;
  position: relative;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.right-column h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: bolder;
  color: white;
}

.right-column .preview {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: white;
}

.right-column .description {
  font-size: 1.2rem;
  margin-bottom: 1em;
  color: white;
  white-space: pre-line;
}

.honey-button {
  font-size: 18px;
  padding: 8px 16px;
  background-color: #f7c781;
  border: 2px solid #c0c0c0;
  border-radius: 25px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}

.honey-button:hover {
  background-color: #c0c0c0;
  color: #1e1e1e;
}

.job-types {
  list-style: none;
  padding: 0;
  margin: 0;
}

.job-types li {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: white;
}

.reviews-section {
  margin-top: 2rem;
}

.reviews-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: white;
}

.review {
  background-color: rgba(30, 30, 30, 0.9);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.review h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
}

.review .rating,
.review .comment,
.review .date {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: white;
}

@media (max-width: 768px) {
  .item-container {
    flex-direction: column;
    padding: 1rem;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .right-column h1 {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .item-container {
    padding: 1rem;
  }
}
</style>
