<template>
  <div class="wrapper">
    <h1>Add/Update User</h1>

    <div class="content">
      <div class="left">
        <select v-model="selectedUser" @change="loadUser">
          <option disabled value="">Please select one</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.name }}
          </option>
        </select>

        <input type="text" v-model="user.name" placeholder="Name" />
        <input type="email" v-model="user.email" placeholder="Email" />
        <input type="password" v-model="user.password" placeholder="Password" />
        <input
          type="text"
          v-model="user.profilePicture"
          placeholder="Profile Picture"
        />
        <textarea v-model="user.bio" placeholder="Bio"></textarea>

        <select v-model="user.contractor">
          <option value="">No Contractor</option>
          <option
            v-for="contractor in contractors"
            :key="contractor._id"
            :value="contractor._id"
          >
            {{ contractor.company }}
          </option>
        </select>

        <div class="final-buttons">
          <button @click="addUser">Add User</button>
          <button @click="updateUser">Update User</button>
          <button @click="deleteUser">Delete User</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";

const users = ref([]);
const contractors = ref([]);
const selectedUser = ref("");
const user = ref({
  name: "",
  email: "",
  password: "",
  profilePicture: "",
  bio: "",
  contractor: "",
});

onMounted(async () => {
  await getUsers();
  await getContractors();
});

function loadUser() {
  const foundUser = users.value.find((u) => u._id === selectedUser.value);
  user.value = { ...foundUser, password: "" };
  // Ensure the contractor dropdown is updated
  user.value.contractor = foundUser.contractor ? foundUser.contractor._id : "";
}

async function getUsers() {
  try {
    const response = await $fetch("/api/users");
    users.value = response || [];
    console.log(users.value);
  } catch (error) {
    alert("Error fetching users: " + error.message);
    console.error("Error fetching users:", error);
  }
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

async function addUser() {
  try {
    await $fetch("/api/users", {
      method: "POST",
      body: user.value,
    });
    alert("User added successfully");
    getUsers();
  } catch (error) {
    alert("Error adding user: " + error.message);
    console.error("Error adding user:", error);
  }
}

async function updateUser() {
  try {
    await $fetch(`/api/users/${user.value._id}`, {
      method: "PUT",
      body: user.value,
    });
    alert("User updated successfully");
    getUsers();
  } catch (error) {
    alert("Error updating user: " + error.message);
    console.error("Error updating user:", error);
  }
}

async function deleteUser() {
  if (!selectedUser.value) {
    alert("Please select a user to delete");
    return;
  }

  try {
    await $fetch(`/api/users/${user.value._id}`, {
      method: "DELETE",
    });
    alert("User deleted successfully");
    init();
  } catch (error) {
    alert("Error deleting user: " + error.message);
    console.error("Error deleting user:", error);
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
    contractor: "",
  };
  selectedUser.value = "";
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
</style>
  