<template>
  <div class="wrapper">
    <h1>Add/Update Agency</h1>

    <div class="content">
      <div class="section">
        <h2>Select Agency</h2>
        <select
          v-model="selectedAgency"
          @change="loadAgency"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="agency in sortedAgencies"
            :key="agency._id"
            :value="agency._id"
          >
            {{ agency.company }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="agency.company" placeholder=" " />
          <label>Company</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="agency.picture" placeholder=" " />
          <label>Picture</label>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="agency.phone" placeholder=" " />
          <label>Phone</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="agency.email" placeholder=" " />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="agency.website" placeholder=" " />
          <label>Website</label>
        </div>
      </div>

      <div class="section">
        <h2>Address</h2>
        <div class="address">
          <div class="input-wrapper">
            <input
              type="text"
              v-model="agency.address.streetAddress"
              placeholder=" "
            />
            <label>Street Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="agency.address.secondaryAddress"
              placeholder=" "
            />
            <label>Secondary Address</label>
          </div>
          <div class="input-wrapper">
            <input type="text" v-model="agency.address.city" placeholder=" " />
            <label>City</label>
          </div>
          <div class="input-wrapper">
            <input type="text" v-model="agency.address.state" placeholder=" " />
            <label>State</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="agency.address.ZIPCode"
              placeholder=" "
            />
            <label>ZIP Code</label>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Operating States</h2>
        <ProfileDropdown
          label="Select Operating States"
          :items="states"
          :selectedItems="agency.operatingStates"
          @update:selectedItems="updateOperatingStates"
        />
      </div>

      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addAgency" class="action-button">Add Agency</button>
        <button @click="updateAgency" class="action-button">
          Update Agency
        </button>
        <button @click="deleteAgency" class="action-button">
          Delete Agency
        </button>
        <button @click="resetRatings" class="action-button">
          Reset All Ratings
        </button>
      </div>

      <div class="section delete-all-section">
        <label for="delete-confirmation"
          >Type "Delete All Agencies" to confirm:</label
        >
        <input
          type="text"
          id="delete-confirmation"
          v-model="deleteConfirmation"
          placeholder="Delete All Agencies"
        />
        <button
          @click="deleteAllAgencies"
          :disabled="deleteConfirmation !== 'Delete All Agencies'"
          class="action-button"
        >
          Delete All Agencies
        </button>
      </div>

      <div class="section navigation-buttons">
        <h2>Navigate to Other Pages</h2>
        <button
          @click="navigateTo('/contractor/editContractors')"
          class="action-button"
        >
          Edit Contractors
        </button>
        <button
          @click="navigateTo('/subcontractor/editSubcontractors')"
          class="action-button"
        >
          Edit Subcontractors
        </button>
        <button
          @click="navigateTo('/supplier/editSuppliers')"
          class="action-button"
        >
          Edit Suppliers
        </button>
      </div>
    </div>

    <!-- Notification Popup -->
    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { states } from "/utils/states.js";
import { useRouter } from "vue-router"; // Import useRouter for navigation

const agencies = ref([]);
const selectedAgency = ref("");
const agency = ref({
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
});

const deleteConfirmation = ref("");

const notificationMessage = ref(""); // Notification message
const notificationType = ref("info"); // Notification type: 'info', 'success', 'error'

// Use the Vue Router to navigate to different pages
const router = useRouter();

// Function to navigate to different edit pages
function navigateTo(route) {
  router.push(route);
}

// Computed property to sort agencies alphabetically by company name
const sortedAgencies = computed(() => {
  return [...agencies.value].sort((a, b) => a.company.localeCompare(b.company));
});

onMounted(async () => {
  await getAgencies();
});

function initializeAgencyFields(agency) {
  let needsUpdate = false;

  // Ensure the agency has an address object
  if (!agency.address) {
    agency.address = {};
    needsUpdate = true;
  }

  // Check each field in the address object and set defaults if they are missing
  const addressFields = [
    "streetAddress",
    "secondaryAddress",
    "city",
    "state",
    "ZIPCode",
  ];
  addressFields.forEach((field) => {
    if (agency.address[field] === undefined) {
      agency.address[field] = "";
      needsUpdate = true;
    }
  });

  // Check operatingStates
  if (agency.operatingStates === undefined) {
    agency.operatingStates = [];
    needsUpdate = true;
  }

  // Check for the rest of the properties and ensure they exist
  if (agency.company === undefined) {
    agency.company = "";
    needsUpdate = true;
  }
  if (agency.picture === undefined) {
    agency.picture = "SSLogo.webp";
    needsUpdate = true;
  }
  if (agency.phone === undefined) {
    agency.phone = "";
    needsUpdate = true;
  }
  if (agency.email === undefined) {
    agency.email = "";
    needsUpdate = true;
  }
  if (agency.website === undefined) {
    agency.website = "";
    needsUpdate = true;
  }

  return needsUpdate;
}

function loadAgency() {
  const foundAgency = agencies.value.find(
    (c) => c._id === selectedAgency.value
  );
  if (foundAgency) {
    // Initialize all fields for the agency and check if any changes are needed
    const needsUpdate = initializeAgencyFields(foundAgency);

    // Assign the agency value after initialization
    agency.value = { ...foundAgency };

    // Only update if changes were made during initialization
    if (needsUpdate) {
      updateAgency();
    }
  } else {
    // Reset to default values if no agency is selected
    agency.value = {
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
    };
  }
}

async function getAgencies() {
  try {
    const response = await $fetch("/api/agencies");
    agencies.value = response || [];
    agencies.value.forEach(initializeAgencyFields); // Ensure all agencies have initialized fields
  } catch (error) {
    showNotification("Error fetching agencies: " + error.message, "error");
  }
}

async function addAgency() {
  try {
    const savedAgency = await $fetch("/api/agencies", {
      method: "POST",
      body: agency.value,
    });
    showNotification("Agency added successfully", "success");
    await getAgencies();
  } catch (error) {
    showNotification("Error adding agency: " + error.message, "error");
  }
}

async function updateAgency() {
  try {
    if (agency.value._id) {
      await $fetch(`/api/agencies/${agency.value._id}`, {
        method: "PUT",
        body: agency.value,
      });
      showNotification("Agency updated successfully", "success");
      getAgencies();
    }
  } catch (error) {
    showNotification("Error updating agency: " + error.message, "error");
  }
}

async function deleteAgency() {
  if (!selectedAgency.value) {
    showNotification("Please select a agency to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/agencies/${agency.value._id}`, {
      method: "DELETE",
    });
    showNotification("Agency deleted successfully", "success");
    await getAgencies();
  } catch (error) {
    showNotification("Error deleting agency: " + error.message, "error");
  }
}

async function deleteAllAgencies() {
  if (deleteConfirmation.value !== "Delete All Agencies") {
    showNotification("Please type 'Delete All Agencies' to confirm", "error");
    return;
  }

  try {
    await $fetch("/api/agencies/all", {
      method: "DELETE",
    });
    showNotification("All agencies deleted successfully", "success");
    await getAgencies();
  } catch (error) {
    showNotification("Error deleting all agencies: " + error.message, "error");
  }
}

async function resetRatings() {
  try {
    await $fetch("/api/agencies/reset", {
      method: "PUT",
    });
    showNotification("All agency ratings have been reset to zero.", "success");
    await getAgencies();
  } catch (error) {
    showNotification("Error resetting ratings: " + error.message, "error");
  }
}

function updateOperatingStates(states) {
  agency.value.operatingStates = states;
}

// Function to show notifications
function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.wrapper {
  padding: 2rem;
  width: 100%;
  margin: 0;
  min-height: 100vh;
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.section {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"],
.input-wrapper input[type="email"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="text"]:focus,
.input-wrapper input[type="email"]:focus {
  border-color: #4caf50;
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.action-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  text-align: left;
  display: inline-block;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.action-button:hover {
  background-color: #ff8210;
  color: white;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-buttons {
  text-align: center;
}

.address {
  margin-bottom: 2rem;
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

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: background-color 0.3s, color 0.3s;
}

.dropdown-button:hover {
  background-color: #ff8210;
  color: white;
}

.navigation-buttons {
  text-align: center;
  margin-top: 2rem;
}
</style>
