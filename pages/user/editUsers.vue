<template>
  <div class="wrapper">
    <h1>Add/Update User</h1>

    <div class="content">
      <div class="section">
        <h2>Select User</h2>
        <select
          v-model="selectedUser"
          @change="loadUser"
          class="dropdown-button"
        >
          <option disabled value="">Please select one</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="section">
        <h2>General Information</h2>
        <div class="input-wrapper">
          <input type="text" v-model="user.name" placeholder=" " />
          <label>Name</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="user.email" placeholder=" " />
          <label>Email</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="user.profilePicture" placeholder=" " />
          <label>Profile Picture</label>
        </div>
        <div class="input-wrapper">
          <textarea v-model="user.bio" placeholder=" "></textarea>
          <label>Bio</label>
        </div>
      </div>

      <div class="section">
        <h2>Assign Companies</h2>
        <div class="input-wrapper">
          <button @click="toggleDropdown" class="company-button">
            {{ assignedCompanyNames }}
          </button>
          <div v-if="isLoading" class="loading-spinner"></div>
          <transition name="dropdown">
            <div v-if="showDropdown" class="dropdown">
              <div class="dropdown-section">
                <h3>Contractors</h3>
                <div
                  v-for="contractor in contractors"
                  :key="contractor._id"
                  class="dropdown-item"
                  :class="{ selected: isSelected(contractor._id) }"
                  @click="toggleCompany(contractor, 'Contractor')"
                >
                  {{ contractor.company }}
                </div>
              </div>
              <div class="dropdown-section">
                <h3>Subcontractors</h3>
                <div
                  v-for="subcontractor in subcontractors"
                  :key="subcontractor._id"
                  class="dropdown-item"
                  :class="{ selected: isSelected(subcontractor._id) }"
                  @click="toggleCompany(subcontractor, 'Subcontractor')"
                >
                  {{ subcontractor.company }}
                </div>
              </div>
              <div class="dropdown-section">
                <h3>Suppliers</h3>
                <div
                  v-for="supplier in suppliers"
                  :key="supplier._id"
                  class="dropdown-item"
                  :class="{ selected: isSelected(supplier._id) }"
                  @click="toggleCompany(supplier, 'Supplier')"
                >
                  {{ supplier.company }}
                </div>
              </div>
              <div class="dropdown-section">
                <h3>Agencies</h3>
                <div
                  v-for="agency in agencies"
                  :key="agency._id"
                  class="dropdown-item"
                  :class="{ selected: isSelected(agency._id) }"
                  @click="toggleCompany(agency, 'Agency')"
                >
                  {{ agency.company }}
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="section" v-if="user.businesses.length">
        <h2>Assigned Companies</h2>
        <ul class="assigned-companies">
          <li v-for="(business, index) in user.businesses" :key="business._id">
            <span class="company-name">{{ business.company }}</span>
            <button @click="removeCompany(index)" class="remove-button">
              Remove
            </button>
          </li>
        </ul>
      </div>

      <div class="section">
        <h2>Password</h2>
        <div v-if="user.password">
          <div class="input-wrapper">
            <input type="password" v-model="currentPassword" placeholder=" " />
            <label>Current Password</label>
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="newPassword" placeholder=" " />
            <label>New Password</label>
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="confirmPassword" placeholder=" " />
            <label>Confirm New Password</label>
          </div>
        </div>
        <div v-else>
          <p>No password set.</p>
          <div class="input-wrapper">
            <input type="password" v-model="newPassword" placeholder=" " />
            <label>Set Password</label>
          </div>
          <div class="input-wrapper">
            <input type="password" v-model="confirmPassword" placeholder=" " />
            <label>Confirm Password</label>
          </div>
        </div>
      </div>

      <div class="section action-buttons">
        <button @click="addUser" class="action-button">Add User</button>
        <button @click="updateUser" class="action-button">Update User</button>
        <button @click="deleteUser" class="action-button">Delete User</button>
      </div>
    </div>

    <SubcomponentsNotificationPopup
      v-if="notificationMessage"
      :message="notificationMessage"
      :type="notificationType"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const users = ref([]);
const contractors = ref([]);
const subcontractors = ref([]);
const suppliers = ref([]);
const agencies = ref([]);

const selectedUser = ref("");
const user = ref({
  name: "",
  email: "",
  password: "",
  profilePicture: "",
  bio: "",
  businesses: [],
  businessTypes: [],
});

const showDropdown = ref(false);
const isLoading = ref(true);

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const notificationMessage = ref(""); // Notification message
const notificationType = ref("info"); // Notification type: 'info', 'success', 'error'

// Use the Vue Router to navigate to different pages
const router = useRouter();

// Compute assigned company names for display
const assignedCompanyNames = computed(() => {
  if (!user.value.businesses.length) return "No Business Assigned";
  return user.value.businesses.map((business) => business.company).join(", ");
});

onMounted(async () => {
  await loadCompanies();
  await getUsers();
});

async function loadCompanies() {
  isLoading.value = true;
  try {
    await Promise.all([
      getContractors(),
      getSubcontractors(),
      getSuppliers(),
      getAgencies(),
    ]);
    sortBusinesses(); // Sort after fetching
  } catch (error) {
    alert("Error fetching companies: " + error.message);
    console.error("Error fetching companies:", error);
  } finally {
    isLoading.value = false;
  }
}

function sortBusinesses() {
  contractors.value.sort((a, b) => a.company.localeCompare(b.company));
  subcontractors.value.sort((a, b) => a.company.localeCompare(b.company));
  suppliers.value.sort((a, b) => a.company.localeCompare(b.company));
  agencies.value.sort((a, b) => a.company.localeCompare(b.company));
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function loadUser() {
  const foundUser = users.value.find((u) => u._id === selectedUser.value);
  if (foundUser) {
    // Ensure user object contains populated businesses
    user.value = {
      ...foundUser,
      businesses: foundUser.businesses.map((business, index) => ({
        _id: business._id || business,
        company: getCompanyName(
          business._id || business,
          foundUser.businessTypes[index]
        ),
      })),
      password: "",
    };
  }
}

async function getUsers() {
  try {
    const response = await $fetch("/api/users");
    users.value = response || [];
  } catch (error) {
    alert("Error fetching users: " + error.message);
    console.error("Error fetching users:", error);
  }
}

async function getContractors() {
  try {
    const response = await $fetch("/api/contractors");
    contractors.value = response || [];
  } catch (error) {
    console.error("Error fetching contractors:", error);
  }
}

async function getSubcontractors() {
  try {
    const response = await $fetch("/api/subcontractors");
    subcontractors.value = response || [];
  } catch (error) {
    console.error("Error fetching subcontractors:", error);
  }
}

async function getSuppliers() {
  try {
    const response = await $fetch("/api/suppliers");
    suppliers.value = response || [];
  } catch (error) {
    console.error("Error fetching suppliers:", error);
  }
}

async function getAgencies() {
  try {
    const response = await $fetch("/api/agencies");
    agencies.value = response || [];
  } catch (error) {
    console.error("Error fetching agencies:", error);
  }
}

function toggleCompany(company, type) {
  const index = user.value.businesses.findIndex((b) => b._id === company._id);
  if (index === -1) {
    user.value.businesses.push(company);
    user.value.businessTypes.push(type);
  } else {
    user.value.businesses.splice(index, 1);
    user.value.businessTypes.splice(index, 1);
  }
}

function isSelected(companyId) {
  return user.value.businesses.some((business) => business._id === companyId);
}

function getCompanyName(companyId, type) {
  let company;
  switch (type) {
    case "Contractor":
      company = contractors.value.find((c) => c._id === companyId);
      break;
    case "Subcontractor":
      company = subcontractors.value.find((s) => s._id === companyId);
      break;
    case "Supplier":
      company = suppliers.value.find((s) => s._id === companyId);
      break;
    case "Agency":
      company = agencies.value.find((a) => a._id === companyId);
      break;
    default:
      company = null;
  }
  return company ? company.company : "Unknown Company";
}

function removeCompany(index) {
  user.value.businesses.splice(index, 1);
  user.value.businessTypes.splice(index, 1);
}

async function addUser() {
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: user.value,
    });
    showNotification("User added successfully", "success");
    getUsers();
  } catch (error) {
    showNotification("Error adding user: " + error.message, "error");
  }
}

async function updateUser() {
  if (newPassword.value !== confirmPassword.value) {
    showNotification("Passwords do not match", "error");
    return;
  }

  try {
    await $fetch(`/api/users/${user.value._id}`, {
      method: "PUT",
      body: { ...user.value, password: newPassword.value },
    });
    showNotification("User updated successfully", "success");
    getUsers();
  } catch (error) {
    showNotification("Error updating user: " + error.message, "error");
  }
}

async function deleteUser() {
  if (!selectedUser.value) {
    showNotification("Please select a user to delete", "error");
    return;
  }

  try {
    await $fetch(`/api/users/${user.value._id}`, {
      method: "DELETE",
    });
    showNotification("User deleted successfully", "success");
    init();
  } catch (error) {
    showNotification("Error deleting user: " + error.message, "error");
  }
}

function init() {
  getUsers();
  user.value = {
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    bio: "",
    businesses: [],
    businessTypes: [],
  };
  selectedUser.value = "";
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
  color: black;
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
.input-wrapper input[type="email"],
.input-wrapper input[type="password"],
.input-wrapper textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-wrapper input[type="text"]:focus,
.input-wrapper input[type="email"]:focus,
.input-wrapper input[type="password"]:focus,
.input-wrapper textarea:focus {
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
.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper textarea:focus + label,
.input-wrapper textarea:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
}

textarea {
  height: 5rem;
}

.company-button {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  text-align: left;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.company-button:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
}

.assigned-companies {
  list-style-type: none;
  padding: 0;
}

.assigned-companies li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.company-name {
  font-size: 16px;
  color: #333;
}

.remove-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-button:hover {
  background-color: #c0392b;
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

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4caf50;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dropdown {
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
  position: absolute;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-section {
  padding: 10px;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dropdown-item:hover,
.dropdown-item.selected {
  background-color: #f0f0f0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
