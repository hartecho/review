<template>
  <div class="wrapper">
    <h1>Add/Update Contractor</h1>

    <div class="content">
      <div class="left">
        <select v-model="selectedContractor" @change="loadContractor">
          <option disabled value="">Please select one</option>
          <option
            v-for="contractor in contractors"
            :key="contractor._id"
            :value="contractor._id"
          >
            {{ contractor.company }}
          </option>
        </select>

        <input type="text" v-model="contractor.company" placeholder="Company" />
        <input type="text" v-model="contractor.picture" placeholder="Picture" />
        <input type="text" v-model="contractor.phone" placeholder="Phone" />
        <input type="email" v-model="contractor.email" placeholder="Email" />
        <input type="text" v-model="contractor.website" placeholder="Website" />

        <div class="address">
          <input
            type="text"
            v-model="contractor.address.streetAddress"
            placeholder="Street Address"
          />
          <input
            type="text"
            v-model="contractor.address.secondaryAddress"
            placeholder="Secondary Address"
          />
          <input
            type="text"
            v-model="contractor.address.city"
            placeholder="City"
          />
          <input
            type="text"
            v-model="contractor.address.state"
            placeholder="State"
          />
          <input
            type="text"
            v-model="contractor.address.ZIPCode"
            placeholder="ZIP Code"
          />
        </div>

        <div class="tags">
          <div
            v-for="tag in availableTags"
            :key="tag.enum"
            class="tag-checkbox"
          >
            <label>
              <input
                type="checkbox"
                :value="tag.enum"
                v-model="contractor.tags"
              />
              {{ tag.enum }} ({{ tag.description }})
            </label>
          </div>
        </div>

        <div class="final-buttons">
          <button @click="addContractor">Add Contractor</button>
          <button @click="updateContractor">Update Contractor</button>
          <button @click="deleteContractor">Delete Contractor</button>
          <button @click="resetRatings">Reset All Ratings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const contractors = ref([]);
const selectedContractor = ref("");
const contractor = ref({
  company: "",
  picture: "",
  phone: "",
  email: "",
  website: "",
  address: {
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    ZIPCode: "",
  },
  tags: [],
});

const availableTags = [
  { enum: "GEN", description: "General Contractor" },
  { enum: "FLR", description: "Flooring" },
  { enum: "CTP", description: "Countertops" },
  { enum: "CAB", description: "Cabinets" },
  { enum: "CON", description: "Concrete and Masonry" },
  { enum: "STL", description: "Steel and Metal Fabrication" },
  { enum: "FRM", description: "Framing" },
  { enum: "ROF", description: "Roofing" },
  { enum: "SID", description: "Siding" },
  { enum: "WND", description: "Windows and Doors" },
  { enum: "LND", description: "Landscaping and Hardscaping" },
  { enum: "DRY", description: "Drywall and Plaster" },
  { enum: "PNT", description: "Painting and Finishing" },
  { enum: "INS", description: "Insulation" },
  { enum: "CLG", description: "Ceiling Systems" },
  { enum: "HVAC", description: "HVAC" },
  { enum: "PLM", description: "Plumbing" },
  { enum: "ELEC", description: "Electrical" },
  { enum: "EXC", description: "Excavation" },
  { enum: "DEM", description: "Demolition" },
  { enum: "GRD", description: "Grading and Paving" },
  { enum: "FPS", description: "Fire Protection and Sprinkler Systems" },
  { enum: "SEC", description: "Security Systems" },
  { enum: "AV", description: "Audio-Visual Installations" },
  { enum: "ELEV", description: "Elevator and Escalator Installation" },
  { enum: "SOL", description: "Solar Energy and Green Building Solutions" },
  { enum: "UTIL", description: "Utility Contractors" },
  { enum: "FIN", description: "Finishing Contractors" },
  { enum: "CAR", description: "Carpentry and Woodwork" },
  { enum: "TLE", description: "Tile and Stone Installation" },
  { enum: "GLS", description: "Glass and Glazing" },
  { enum: "SPC", description: "Specialty Coatings and Sealants" },
  { enum: "REN", description: "Renovation and Restoration" },
  { enum: "HIS", description: "Historic Restoration" },
  { enum: "REM", description: "Remodeling" },
  { enum: "WTR", description: "Waterproofing and Mold Remediation" },
  { enum: "ENV", description: "Environmental Contractors" },
  { enum: "ASB", description: "Asbestos Abatement" },
  { enum: "LEAD", description: "Lead Paint Removal" },
  { enum: "ENVC", description: "Environmental Cleanup and Remediation" },
  { enum: "DB", description: "Design and Build Contractors" },
  { enum: "ARC", description: "Architectural Services" },
  { enum: "ENG", description: "Engineering Services" },
  { enum: "LOG", description: "Logistics and Material Handling Contractors" },
  { enum: "WARE", description: "Warehouse Setup" },
  { enum: "IEQ", description: "Industrial Equipment Installation" },
  { enum: "SPEQ", description: "Specialty Equipment Contractors" },
  { enum: "CKE", description: "Commercial Kitchen Equipment" },
  { enum: "LMEQ", description: "Laboratory and Medical Equipment" },
  { enum: "FAC", description: "Facade and Cladding Contractors" },
  { enum: "EXC", description: "Exterior Cladding Systems" },
  { enum: "CUR", description: "Curtain Wall Systems" },
  { enum: "OTH", description: "Other" },
];

onMounted(async () => {
  getContractors();
});

function loadContractor() {
  const foundContractor = contractors.value.find(
    (c) => c._id === selectedContractor.value
  );
  contractor.value = { ...foundContractor };
}

async function getContractors() {
  try {
    const response = await $fetch("/api/contractors");
    contractors.value = response || [];
    console.log(contractors.value);
  } catch (error) {
    alert("Error fetching contractors: " + error.message);
    console.error("Error fetching contractors:", error);
  }
}

async function addContractor() {
  try {
    await $fetch("/api/contractors", {
      method: "POST",
      body: contractor.value,
    });
    alert("Contractor added successfully");
    getContractors();
  } catch (error) {
    alert("Error adding contractor: " + error.message);
    console.error("Error adding contractor:", error);
  }
}

async function updateContractor() {
  try {
    await $fetch(`/api/contractors/${contractor.value._id}`, {
      method: "PUT",
      body: contractor.value,
    });
    alert("Contractor updated successfully");
    getContractors();
  } catch (error) {
    alert("Error updating contractor: " + error.message);
    console.error("Error updating contractor:", error);
  }
}

async function deleteContractor() {
  if (!selectedContractor.value) {
    alert("Please select a contractor to delete");
    return;
  }

  try {
    await $fetch(`/api/contractors/${contractor.value._id}`, {
      method: "DELETE",
    });
    alert("Contractor deleted successfully");
    init();
  } catch (error) {
    alert("Error deleting contractor: " + error.message);
    console.error("Error deleting contractor:", error);
  }
}

async function resetRatings() {
  try {
    await $fetch("/api/contractors/reset", {
      method: "PUT",
    });
    alert("All contractor ratings have been reset to zero.");
    getContractors();
  } catch (error) {
    alert("Error resetting ratings: " + error.message);
    console.error("Error resetting ratings:", error);
  }
}

function init() {
  getContractors();
  contractor.value = {
    name: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: {
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      ZIPCode: "",
    },
    tags: [],
  };
  selectedContractor.value = "";
}
</script>

<style scoped>
.wrapper {
  padding: 6rem 0;
  width: 90%;
  margin: 0 auto;
  min-height: 55rem;
  height: auto;
}

.content {
  display: flex;
  gap: 2rem;
}

.left {
  width: 50%;
}

input,
textarea,
select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
}

textarea {
  height: 10rem;
}

label,
h3 {
  color: black;
}

button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.final-buttons {
  margin-top: 2rem;
}

.address,
.tags {
  margin-bottom: 1rem;
}

.tags {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.tag-checkbox {
  display: flex;
  align-items: center;
}

.tag-checkbox input {
  margin-right: 8px;
}
</style>
