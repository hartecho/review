<template>
  <div class="login-container">
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" v-model="password" type="password" required />
      </div>
      <button type="submit" :disabled="!canSubmit">Login</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const message = ref("");

const canSubmit = computed(() => email.value.trim() && password.value.trim());

const submitLogin = async () => {
  if (!canSubmit.value) {
    message.value = "Please fill in all fields.";
    return;
  }

  try {
    const response = await $fetch("/api/users/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    message.value = "Login successful! Redirecting...";
    console.log("Token:", response.token); // Handle the token as needed
    store.setToken(response.token);
  } catch (error) {
    message.value = error.data?.message || "Failed to login";
  }
};
</script>