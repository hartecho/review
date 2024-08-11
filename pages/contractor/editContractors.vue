<template>
  <div class="wrapper">
    <h1>Add/Update Contractor</h1>

    <div class="content">
      <div class="section">
        <h2>Select Contractor</h2>
        <select
          v-model="selectedContractor"
          @change="loadContractor"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="contractor in sortedContractors"
            :key="contractor._id"
            :value="contractor._id"
          >
            {{ contractor.company }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="contractor.company" placeholder=" " />
          <label>Company</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="contractor.picture" placeholder=" " />
          <label>Picture</label>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="contractor.phone" placeholder=" " />
          <label>Phone</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="contractor.email" placeholder=" " />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="contractor.website" placeholder=" " />
          <label>Website</label>
        </div>
      </div>

      <div class="section">
        <h2>Address</h2>
        <div class="address">
          <div class="input-wrapper">
            <input
              type="text"
              v-model="contractor.address.streetAddress"
              placeholder=" "
            />
            <label>Street Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="contractor.address.secondaryAddress"
              placeholder=" "
            />
            <label>Secondary Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="contractor.address.city"
              placeholder=" "
            />
            <label>City</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="contractor.address.state"
              placeholder=" "
            />
            <label>State</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="contractor.address.ZIPCode"
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
          :selectedItems="contractor.operatingStates"
          @update:selectedItems="updateOperatingStates"
        />
      </div>

      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addContractor" class="action-button">
          Add Contractor
        </button>
        <button @click="updateContractor" class="action-button">
          Update Contractor
        </button>
        <button @click="deleteContractor" class="action-button">
          Delete Contractor
        </button>
        <button @click="resetRatings" class="action-button">
          Reset All Ratings
        </button>
      </div>

      <div class="section delete-all-section">
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
          class="action-button"
        >
          Delete All Contractors
        </button>
      </div>

      <div class="section navigation-buttons">
        <h2>Navigate to Other Pages</h2>
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
        <button
          @click="navigateTo('/agency/editAgencies')"
          class="action-button"
        >
          Edit Agencies
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

// Computed property to sort contractors alphabetically by company name
const sortedContractors = computed(() => {
  return [...contractors.value].sort((a, b) =>
    a.company.localeCompare(b.company)
  );
});

onMounted(async () => {
  await getContractors();
});

function initializeContractorFields(contractor) {
  let needsUpdate = false;
  if (!contractor) {
    console.log("Contractor undefined");
  }

  if (!contractor._id) {
    console.log("Contractor name with no _id: " + contractor.company);
  }

  // Ensure the contractor has an address object
  if (!contractor.address) {
    contractor.address = {};
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
    if (contractor.address[field] === undefined) {
      contractor.address[field] = "";
      needsUpdate = true;
    }
  });

  // Check operatingStates
  if (contractor.operatingStates === undefined) {
    contractor.operatingStates = [];
    needsUpdate = true;
  }

  // Check for the rest of the properties and ensure they exist
  if (contractor.company === undefined) {
    contractor.company = "";
    needsUpdate = true;
  }
  if (contractor.picture === undefined) {
    contractor.picture = "SSLogo.webp";
    needsUpdate = true;
  }
  if (contractor.phone === undefined) {
    contractor.phone = "";
    needsUpdate = true;
  }
  if (contractor.email === undefined) {
    contractor.email = "";
    needsUpdate = true;
  }
  if (contractor.website === undefined) {
    contractor.website = "";
    needsUpdate = true;
  }

  return needsUpdate;
}

function loadContractor() {
  const foundContractor = contractors.value.find(
    (c) => c._id === selectedContractor.value
  );
  if (foundContractor) {
    // Initialize all fields for the contractor and check if any changes are needed
    const needsUpdate = initializeContractorFields(foundContractor);

    // Assign the contractor value after initialization
    contractor.value = { ...foundContractor };

    // Only update if changes were made during initialization
    if (needsUpdate) {
      updateContractor();
    }
  } else {
    // Reset to default values if no contractor is selected
    contractor.value = {
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

async function getContractors() {
  try {
    // console.log("Fetching Contractors...");
    const response = await $fetch("/api/contractors");
    contractors.value = response || [];
    // console.log("Contractors fetched: " + JSON.stringify(contractors.value));
    contractors.value.forEach(initializeContractorFields); // Ensure all contractors have initialized fields
    // console.log("After initialize");
  } catch (error) {
    showNotification("Error fetching contractors: " + error.message, "error");
  }
}

async function addContractor() {
  try {
    const savedContractor = await $fetch("/api/contractors", {
      method: "POST",
      body: contractor.value,
    });
    showNotification("Contractor added successfully", "success");
    await getContractors();
  } catch (error) {
    showNotification("Error adding contractor: " + error.message, "error");
  }
}

async function updateContractor() {
  try {
    if (contractor.value._id) {
      await $fetch(`/api/contractors/${contractor.value._id}`, {
        method: "PUT",
        body: contractor.value,
      });
      showNotification("Contractor updated successfully", "success");
      getContractors();
    }
  } catch (error) {
    showNotification("Error updating contractor: " + error.message, "error");
  }
}

async function deleteContractor() {
  if (!selectedContractor.value) {
    showNotification("Please select a contractor to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/contractors/${contractor.value._id}`, {
      method: "DELETE",
    });
    showNotification("Contractor deleted successfully", "success");
    await getContractors();
  } catch (error) {
    showNotification("Error deleting contractor: " + error.message, "error");
  }
}

async function deleteAllContractors() {
  if (deleteConfirmation.value !== "Delete All Contractors") {
    showNotification(
      "Please type 'Delete All Contractors' to confirm",
      "error"
    );
    return;
  }

  try {
    await $fetch("/api/contractors/all", {
      method: "DELETE",
    });
    showNotification("All contractors deleted successfully", "success");
    await getContractors();
  } catch (error) {
    showNotification(
      "Error deleting all contractors: " + error.message,
      "error"
    );
  }
}

async function resetRatings() {
  try {
    await $fetch("/api/contractors/reset", {
      method: "PUT",
    });
    showNotification(
      "All contractor ratings have been reset to zero.",
      "success"
    );
    await getContractors();
  } catch (error) {
    showNotification("Error resetting ratings: " + error.message, "error");
  }
}

function updateOperatingStates(states) {
  contractor.value.operatingStates = states;
}

// Function to show notifications
function showNotification(message, type = "info") {
  notificationMessage.value = message;
  notificationType.value = type;
}
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
