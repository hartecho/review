<template>
  <div class="wrapper">
    <h1>Add/Update Subcontractor</h1>

    <div class="content">
      <div class="section">
        <h2>Select Subcontractor</h2>
        <select
          v-model="selectedSubcontractor"
          @change="loadSubcontractor"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="subcontractor in sortedSubcontractors"
            :key="subcontractor._id"
            :value="subcontractor._id"
          >
            {{ subcontractor.company }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="subcontractor.company" placeholder=" " />
          <label>Company</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="subcontractor.picture" placeholder=" " />
          <label>Picture</label>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="subcontractor.phone" placeholder=" " />
          <label>Phone</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="subcontractor.email" placeholder=" " />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="subcontractor.website" placeholder=" " />
          <label>Website</label>
        </div>
      </div>

      <div class="section">
        <h2>Address</h2>
        <div class="address">
          <div class="input-wrapper">
            <input
              type="text"
              v-model="subcontractor.address.streetAddress"
              placeholder=" "
            />
            <label>Street Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="subcontractor.address.secondaryAddress"
              placeholder=" "
            />
            <label>Secondary Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="subcontractor.address.city"
              placeholder=" "
            />
            <label>City</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="subcontractor.address.state"
              placeholder=" "
            />
            <label>State</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="subcontractor.address.ZIPCode"
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
          :selectedItems="subcontractor.operatingStates"
          @update:selectedItems="updateOperatingStates"
        />
      </div>

      <div class="section">
        <h2>Job Types</h2>
        <ProfileDropdown
          label="Select Job Types"
          :items="tagDescriptions"
          :selectedItems="subcontractor.tags"
          @update:selectedItems="updateTags"
        />
      </div>

      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addSubcontractor" class="action-button">
          Add Subcontractor
        </button>
        <button @click="updateSubcontractor" class="action-button">
          Update Subcontractor
        </button>
        <button @click="deleteSubcontractor" class="action-button">
          Delete Subcontractor
        </button>
        <button @click="resetRatings" class="action-button">
          Reset All Ratings
        </button>
      </div>

      <div class="section delete-all-section">
        <label for="delete-confirmation"
          >Type "Delete All Subcontractors" to confirm:</label
        >
        <input
          type="text"
          id="delete-confirmation"
          v-model="deleteConfirmation"
          placeholder="Delete All Subcontractors"
        />
        <button
          @click="deleteAllSubcontractors"
          :disabled="deleteConfirmation !== 'Delete All Subcontractors'"
          class="action-button"
        >
          Delete All Subcontractors
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
import { tagDescriptions } from "/utils/tagDescriptions.js";
import { states } from "/utils/states.js";
import { useRouter } from "vue-router"; // Import useRouter for navigation

const subcontractors = ref([]);
const selectedSubcontractor = ref("");
const subcontractor = ref({
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

const notificationMessage = ref(""); // Notification message
const notificationType = ref("info"); // Notification type: 'info', 'success', 'error'

// Use the Vue Router to navigate to different pages
const router = useRouter();

// Function to navigate to different edit pages
function navigateTo(route) {
  router.push(route);
}

// Computed property to sort subcontractors alphabetically by company name
const sortedSubcontractors = computed(() => {
  return [...subcontractors.value].sort((a, b) =>
    a.company.localeCompare(b.company)
  );
});

onMounted(async () => {
  await getSubcontractors();
});

function initializeSubcontractorFields(subcontractor) {
  let needsUpdate = false;

  // Ensure the subcontractor has an address object
  if (!subcontractor.address) {
    subcontractor.address = {};
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
    if (subcontractor.address[field] === undefined) {
      subcontractor.address[field] = "";
      needsUpdate = true;
    }
  });

  // Check operatingStates
  if (subcontractor.operatingStates === undefined) {
    subcontractor.operatingStates = [];
    needsUpdate = true;
  }

  // Check tags
  if (subcontractor.tags === undefined) {
    subcontractor.tags = [];
    needsUpdate = true;
  }

  // Check for the rest of the properties and ensure they exist
  if (subcontractor.company === undefined) {
    subcontractor.company = "";
    needsUpdate = true;
  }
  if (subcontractor.picture === undefined) {
    subcontractor.picture = "SSLogo.webp";
    needsUpdate = true;
  }
  if (subcontractor.phone === undefined) {
    subcontractor.phone = "";
    needsUpdate = true;
  }
  if (subcontractor.email === undefined) {
    subcontractor.email = "";
    needsUpdate = true;
  }
  if (subcontractor.website === undefined) {
    subcontractor.website = "";
    needsUpdate = true;
  }

  return needsUpdate;
}

function loadSubcontractor() {
  const foundSubcontractor = subcontractors.value.find(
    (c) => c._id === selectedSubcontractor.value
  );
  if (foundSubcontractor) {
    // Initialize all fields for the subcontractor and check if any changes are needed
    const needsUpdate = initializeSubcontractorFields(foundSubcontractor);

    // Assign the subcontractor value after initialization
    subcontractor.value = { ...foundSubcontractor };

    // Only update if changes were made during initialization
    if (needsUpdate) {
      updateSubcontractor();
    }
  } else {
    // Reset to default values if no subcontractor is selected
    subcontractor.value = {
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
    };
  }
}

async function getSubcontractors() {
  try {
    const response = await $fetch("/api/subcontractors");
    subcontractors.value = response || [];
    subcontractors.value.forEach(initializeSubcontractorFields); // Ensure all subcontractors have initialized fields
  } catch (error) {
    showNotification(
      "Error fetching subcontractors: " + error.message,
      "error"
    );
  }
}

async function addSubcontractor() {
  try {
    const savedSubcontractor = await $fetch("/api/subcontractors", {
      method: "POST",
      body: subcontractor.value,
    });
    showNotification("Subcontractor added successfully", "success");
    await getSubcontractors();
  } catch (error) {
    showNotification("Error adding subcontractor: " + error.message, "error");
  }
}

async function updateSubcontractor() {
  try {
    if (subcontractor.value._id) {
      await $fetch(`/api/subcontractors/${subcontractor.value._id}`, {
        method: "PUT",
        body: subcontractor.value,
      });
      showNotification("Subcontractor updated successfully", "success");
      getSubcontractors();
    }
  } catch (error) {
    showNotification("Error updating subcontractor: " + error.message, "error");
  }
}

async function deleteSubcontractor() {
  if (!selectedSubcontractor.value) {
    showNotification("Please select a subcontractor to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/subcontractors/${subcontractor.value._id}`, {
      method: "DELETE",
    });
    showNotification("Subcontractor deleted successfully", "success");
    await getSubcontractors();
  } catch (error) {
    showNotification("Error deleting subcontractor: " + error.message, "error");
  }
}

async function deleteAllSubcontractors() {
  if (deleteConfirmation.value !== "Delete All Subcontractors") {
    showNotification(
      "Please type 'Delete All Subcontractors' to confirm",
      "error"
    );
    return;
  }

  try {
    await $fetch("/api/subcontractors/all", {
      method: "DELETE",
    });
    showNotification("All subcontractors deleted successfully", "success");
    await getSubcontractors();
  } catch (error) {
    showNotification(
      "Error deleting all subcontractors: " + error.message,
      "error"
    );
  }
}

async function resetRatings() {
  try {
    await $fetch("/api/subcontractors/reset", {
      method: "PUT",
    });
    showNotification(
      "All subcontractor ratings have been reset to zero.",
      "success"
    );
    await getSubcontractors();
  } catch (error) {
    showNotification("Error resetting ratings: " + error.message, "error");
  }
}

function updateOperatingStates(states) {
  subcontractor.value.operatingStates = states;
}

function updateTags(tags) {
  subcontractor.value.tags = tags;
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
