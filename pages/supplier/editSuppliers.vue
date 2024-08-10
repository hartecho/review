<template>
  <div class="wrapper">
    <h1>Add/Update Supplier</h1>

    <div class="content">
      <div class="section">
        <h2>Select Supplier</h2>
        <select
          v-model="selectedSupplier"
          @change="loadSupplier"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option
            v-for="supplier in sortedSuppliers"
            :key="supplier._id"
            :value="supplier._id"
          >
            {{ supplier.company }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="supplier.company" placeholder=" " />
          <label>Company</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="supplier.picture" placeholder=" " />
          <label>Picture</label>
        </div>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="supplier.phone" placeholder=" " />
          <label>Phone</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="supplier.email" placeholder=" " />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="supplier.website" placeholder=" " />
          <label>Website</label>
        </div>
      </div>

      <div class="section">
        <h2>Address</h2>
        <div class="address">
          <div class="input-wrapper">
            <input
              type="text"
              v-model="supplier.address.streetAddress"
              placeholder=" "
            />
            <label>Street Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="supplier.address.secondaryAddress"
              placeholder=" "
            />
            <label>Secondary Address</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="supplier.address.city"
              placeholder=" "
            />
            <label>City</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="supplier.address.state"
              placeholder=" "
            />
            <label>State</label>
          </div>
          <div class="input-wrapper">
            <input
              type="text"
              v-model="supplier.address.ZIPCode"
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
          :selectedItems="supplier.operatingStates"
          @update:selectedItems="updateOperatingStates"
        />
      </div>

      <div class="section">
        <h2>Job Types</h2>
        <ProfileDropdown
          label="Select Job Types"
          :items="tagDescriptions"
          :selectedItems="supplier.tags"
          @update:selectedItems="updateTags"
        />
      </div>

      <div class="section action-buttons">
        <h2>Available Actions</h2>
        <button @click="addSupplier" class="action-button">Add Supplier</button>
        <button @click="updateSupplier" class="action-button">
          Update Supplier
        </button>
        <button @click="deleteSupplier" class="action-button">
          Delete Supplier
        </button>
        <button @click="resetRatings" class="action-button">
          Reset All Ratings
        </button>
      </div>

      <div class="section delete-all-section">
        <label for="delete-confirmation"
          >Type "Delete All Suppliers" to confirm:</label
        >
        <input
          type="text"
          id="delete-confirmation"
          v-model="deleteConfirmation"
          placeholder="Delete All Suppliers"
        />
        <button
          @click="deleteAllSuppliers"
          :disabled="deleteConfirmation !== 'Delete All Suppliers'"
          class="action-button"
        >
          Delete All Suppliers
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

const suppliers = ref([]);
const selectedSupplier = ref("");
const supplier = ref({
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

// Computed property to sort suppliers alphabetically by company name
const sortedSuppliers = computed(() => {
  return [...suppliers.value].sort((a, b) =>
    a.company.localeCompare(b.company)
  );
});

onMounted(async () => {
  await getSuppliers();
});

function initializeSupplierFields(supplier) {
  let needsUpdate = false;

  // Ensure the supplier has an address object
  if (!supplier.address) {
    supplier.address = {};
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
    if (supplier.address[field] === undefined) {
      supplier.address[field] = "";
      needsUpdate = true;
    }
  });

  // Check operatingStates
  if (supplier.operatingStates === undefined) {
    supplier.operatingStates = [];
    needsUpdate = true;
  }

  // Check tags
  if (supplier.tags === undefined) {
    supplier.tags = [];
    needsUpdate = true;
  }

  // Check for the rest of the properties and ensure they exist
  if (supplier.company === undefined) {
    supplier.company = "";
    needsUpdate = true;
  }
  if (supplier.picture === undefined) {
    supplier.picture = "SSLogo.webp";
    needsUpdate = true;
  }
  if (supplier.phone === undefined) {
    supplier.phone = "";
    needsUpdate = true;
  }
  if (supplier.email === undefined) {
    supplier.email = "";
    needsUpdate = true;
  }
  if (supplier.website === undefined) {
    supplier.website = "";
    needsUpdate = true;
  }

  return needsUpdate;
}

function loadSupplier() {
  const foundSupplier = suppliers.value.find(
    (c) => c._id === selectedSupplier.value
  );
  if (foundSupplier) {
    // Initialize all fields for the supplier and check if any changes are needed
    const needsUpdate = initializeSupplierFields(foundSupplier);

    // Assign the supplier value after initialization
    supplier.value = { ...foundSupplier };

    // Only update if changes were made during initialization
    if (needsUpdate) {
      updateSupplier();
    }
  } else {
    // Reset to default values if no supplier is selected
    supplier.value = {
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

async function getSuppliers() {
  try {
    const response = await $fetch("/api/suppliers");
    suppliers.value = response || [];
    suppliers.value.forEach(initializeSupplierFields); // Ensure all suppliers have initialized fields
  } catch (error) {
    showNotification("Error fetching suppliers: " + error.message, "error");
  }
}

async function addSupplier() {
  try {
    const savedSupplier = await $fetch("/api/suppliers", {
      method: "POST",
      body: supplier.value,
    });
    showNotification("Supplier added successfully", "success");
    await getSuppliers();
  } catch (error) {
    showNotification("Error adding supplier: " + error.message, "error");
  }
}

async function updateSupplier() {
  try {
    if (supplier.value._id) {
      await $fetch(`/api/suppliers/${supplier.value._id}`, {
        method: "PUT",
        body: supplier.value,
      });
      showNotification("Supplier updated successfully", "success");
      getSuppliers();
    }
  } catch (error) {
    showNotification("Error updating supplier: " + error.message, "error");
  }
}

async function deleteSupplier() {
  if (!selectedSupplier.value) {
    showNotification("Please select a supplier to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/suppliers/${supplier.value._id}`, {
      method: "DELETE",
    });
    showNotification("Supplier deleted successfully", "success");
    await getSuppliers();
  } catch (error) {
    showNotification("Error deleting supplier: " + error.message, "error");
  }
}

async function deleteAllSuppliers() {
  if (deleteConfirmation.value !== "Delete All Suppliers") {
    showNotification("Please type 'Delete All Suppliers' to confirm", "error");
    return;
  }

  try {
    await $fetch("/api/suppliers/all", {
      method: "DELETE",
    });
    showNotification("All suppliers deleted successfully", "success");
    await getSuppliers();
  } catch (error) {
    showNotification("Error deleting all suppliers: " + error.message, "error");
  }
}

async function resetRatings() {
  try {
    await $fetch("/api/suppliers/reset", {
      method: "PUT",
    });
    showNotification(
      "All supplier ratings have been reset to zero.",
      "success"
    );
    await getSuppliers();
  } catch (error) {
    showNotification("Error resetting ratings: " + error.message, "error");
  }
}

function updateOperatingStates(states) {
  supplier.value.operatingStates = states;
}

function updateTags(tags) {
  supplier.value.tags = tags;
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
