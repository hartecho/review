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

        <ProfileDropdown
          label="Select Operating States"
          :items="availableStates"
          :selectedItems="contractor.operatingStates"
          @update:selectedItems="updateOperatingStates"
        />

        <ProfileDropdown
          label="Select Job Types"
          :items="availableTags"
          :selectedItems="contractor.tags"
          @update:selectedItems="updateTags"
        />

        <div class="final-buttons">
          <button @click="addContractor">Add Contractor</button>
          <button @click="updateContractor">Update Contractor</button>
          <button @click="deleteContractor">Delete Contractor</button>
          <button @click="resetRatings">Reset All Ratings</button>
        </div>

        <div class="delete-all-section">
          <label for="delete-confirmation"
            >Type "Delete All Contractors" to confirm:</label
          >
          <input
            type="text"
            id="delete-confirmation"
            v-model="deleteConfirmation"
            placeholder="Delete All Contractors"
          />
          <button
            @click="deleteAllContractors"
            :disabled="deleteConfirmation !== 'Delete All Contractors'"
          >
            Delete All Contractors
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  operatingStates: [],
  tags: [],
});

const deleteConfirmation = ref("");

const availableStates = [
  { abbreviation: "AL", name: "Alabama" },
  { abbreviation: "AK", name: "Alaska" },
  { abbreviation: "AZ", name: "Arizona" },
  { abbreviation: "AR", name: "Arkansas" },
  { abbreviation: "CA", name: "California" },
  { abbreviation: "CO", name: "Colorado" },
  { abbreviation: "CT", name: "Connecticut" },
  { abbreviation: "DE", name: "Delaware" },
  { abbreviation: "FL", name: "Florida" },
  { abbreviation: "GA", name: "Georgia" },
  { abbreviation: "HI", name: "Hawaii" },
  { abbreviation: "ID", name: "Idaho" },
  { abbreviation: "IL", name: "Illinois" },
  { abbreviation: "IN", name: "Indiana" },
  { abbreviation: "IA", name: "Iowa" },
  { abbreviation: "KS", name: "Kansas" },
  { abbreviation: "KY", name: "Kentucky" },
  { abbreviation: "LA", name: "Louisiana" },
  { abbreviation: "ME", name: "Maine" },
  { abbreviation: "MD", name: "Maryland" },
  { abbreviation: "MA", name: "Massachusetts" },
  { abbreviation: "MI", name: "Michigan" },
  { abbreviation: "MN", name: "Minnesota" },
  { abbreviation: "MS", name: "Mississippi" },
  { abbreviation: "MO", name: "Missouri" },
  { abbreviation: "MT", name: "Montana" },
  { abbreviation: "NE", name: "Nebraska" },
  { abbreviation: "NV", name: "Nevada" },
  { abbreviation: "NH", name: "New Hampshire" },
  { abbreviation: "NJ", name: "New Jersey" },
  { abbreviation: "NM", name: "New Mexico" },
  { abbreviation: "NY", name: "New York" },
  { abbreviation: "NC", name: "North Carolina" },
  { abbreviation: "ND", name: "North Dakota" },
  { abbreviation: "OH", name: "Ohio" },
  { abbreviation: "OK", name: "Oklahoma" },
  { abbreviation: "OR", name: "Oregon" },
  { abbreviation: "PA", name: "Pennsylvania" },
  { abbreviation: "RI", name: "Rhode Island" },
  { abbreviation: "SC", name: "South Carolina" },
  { abbreviation: "SD", name: "South Dakota" },
  { abbreviation: "TN", name: "Tennessee" },
  { abbreviation: "TX", name: "Texas" },
  { abbreviation: "UT", name: "Utah" },
  { abbreviation: "VT", name: "Vermont" },
  { abbreviation: "VA", name: "Virginia" },
  { abbreviation: "WA", name: "Washington" },
  { abbreviation: "WV", name: "West Virginia" },
  { abbreviation: "WI", name: "Wisconsin" },
  { abbreviation: "WY", name: "Wyoming" },
];

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
    const savedContractor = await $fetch("/api/contractors", {
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

async function deleteAllContractors() {
  if (deleteConfirmation.value !== "Delete All Contractors") {
    alert("Please type 'Delete All Contractors' to confirm");
    return;
  }

  try {
    await $fetch("/api/contractors/all", {
      method: "DELETE",
    });
    alert("All contractors deleted successfully");
    getContractors();
  } catch (error) {
    alert("Error deleting all contractors: " + error.message);
    console.error("Error deleting all contractors:", error);
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
    operatingStates: [],
    tags: [],
  };
  selectedContractor.value = "";
}

function updateOperatingStates(states) {
  contractor.value.operatingStates = states;
}

function updateTags(tags) {
  contractor.value.tags = tags;
}
</script>

<style scoped>
.wrapper {
  padding: 6rem 0;
  width: 90%;
  margin: 0 auto;
  min-height: 55rem;
  height: auto;
  font-family: "Roboto", sans-serif;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.content {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.left {
  width: 60%;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

input[type="text"],
input[type="email"],
textarea,
select {
  display: block;
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus {
  border-color: #4caf50;
  outline: none;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

button {
  background-color: #ff8210; /* Color of the logout button */
  border: none;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 0.5rem 0 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e65a00;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.final-buttons {
  text-align: center;
  margin-top: 2rem;
}

.address,
.tags,
.operating-states {
  margin-bottom: 2rem;
}

.tags,
.operating-states {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.tag-checkbox,
.state-checkbox {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
  cursor: pointer;
  user-select: none;
  position: relative;
}

.state-checkbox:hover,
.tag-checkbox:hover {
  background: #e0e0e0;
}

.state-checkbox.checked,
.tag-checkbox.checked {
  background: #ff8210; /* Color of the logout button */
  border-color: #ff8210;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
}

.state-checkbox input,
.tag-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.state-checkbox label,
.tag-checkbox label {
  color: black;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 1rem;
  transition: all 0.3s;
  border-radius: 4px;
}

.state-checkbox.checked label,
.tag-checkbox.checked label {
  color: white;
  /* font-weight: bold; */
}

.delete-all-section {
  margin-top: 2rem;
  text-align: center;
}

.delete-all-section input[type="text"] {
  width: 60%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.delete-all-section input[type="text"]:focus {
  border-color: #ff8210;
  outline: none;
}
</style>
