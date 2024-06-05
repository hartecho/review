<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <div class="profile-details">
      <div class="detail-item">
        <strong>Username:</strong>
        <span>{{ profile.username }}</span>
      </div>
      <div class="detail-item">
        <strong>Email:</strong>
        <span>{{ profile.email }}</span>
      </div>
      <div class="detail-item">
        <strong>First Name:</strong>
        <span>{{ profile.firstName }}</span>
      </div>
      <div class="detail-item">
        <strong>Last Name:</strong>
        <span>{{ profile.lastName }}</span>
      </div>
      <div class="detail-item">
        <strong>Phone Number:</strong>
        <span>{{ profile.phone }}</span>
      </div>
      <div class="detail-item">
        <strong>Address:</strong>
        <span>{{ profile.address }}</span>
      </div>
      <div class="detail-item profile-picture-item">
        <strong>Profile Picture:</strong>
        <img
          v-if="profile.picture"
          :src="profile.picture"
          alt="Profile Picture"
          class="profile-picture-preview"
        />
      </div>
    </div>
    <h2>Change Password</h2>
    <form @submit.prevent="changePassword" class="change-password-form">
      <div class="form-group">
        <label for="currentPassword">Current Password:</label>
        <input
          id="currentPassword"
          v-model="passwords.current"
          type="password"
          required
        />
      </div>
      <div class="form-group">
        <label for="newPassword">New Password:</label>
        <input
          id="newPassword"
          v-model="passwords.new"
          type="password"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm New Password:</label>
        <input
          id="confirmPassword"
          v-model="passwords.confirm"
          type="password"
          required
        />
      </div>
      <button type="submit" :disabled="!canSubmit">Change Password</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const profile = ref({
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  picture: "",
});

const passwords = ref({
  current: "",
  new: "",
  confirm: "",
});

const canSubmit = computed(() => {
  return (
    passwords.value.new &&
    passwords.value.confirm &&
    passwords.value.new === passwords.value.confirm
  );
});

const changePassword = async () => {
  try {
    if (passwords.value.new !== passwords.value.confirm) {
      alert("New passwords do not match.");
      return;
    }
    // Implement the API call to change the password
    const response = await $fetch("/api/auth/change-password", {
      method: "POST",
      body: passwords.value,
    });
    alert("Password changed successfully!");
  } catch (error) {
    alert("Failed to change password. Please try again.");
  }
};

onMounted(async () => {
  try {
    // Fetch the current user's profile data
    const response = await $fetch("/api/auth/profile");
    profile.value = response;
  } catch (error) {
    alert("Failed to load profile. Please try again.");
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background: #0e0e1f;
  border-radius: 15px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profile-container h1,
.profile-container h2 {
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #00b5ad;
}

.profile-details {
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #1e1e2f;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.detail-item:hover {
  transform: translateY(-5px);
}

.detail-item strong {
  margin-bottom: 10px;
  font-size: 1.2em;
  color: #00b5ad;
}

.profile-picture-item {
  grid-column: span 2;
}

.profile-picture-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
}

.change-password-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background: #1e1e2f;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 1.1em;
  color: #00b5ad;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background: #2e2e3e;
  color: #ffffff;
  font-size: 1em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  display: block;
  width: 100%;
  padding: 15px;
  background-color: #00b5ad;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #009f99;
  transform: translateY(-2px);
}
</style>
