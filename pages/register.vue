<!-- components/UserRegistrationForm.vue -->
<template>
  <div class="user-registration">
    <h1>Register User</h1>
    <form @submit.prevent="registerUser">
      <input v-model="username" type="text" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";

const username = ref("");
const email = ref("");
const password = ref("");
const message = ref("");

const registerUser = async () => {
  try {
    const response = await fetch("/api/users/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    });
    const result = await response.json();
    message.value = result.message;
  } catch (error) {
    message.value = "Failed to register user.";
    console.error(error);
  }
};
</script>
  
  <style scoped>
.user-registration input,
.user-registration button {
  display: block;
  margin: 10px 0;
  padding: 8px;
  width: 100%;
}
</style>
  