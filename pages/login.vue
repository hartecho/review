<template>
  <div>
    <h1>Login</h1>
    <div v-if="emailSignIn">
      <form @submit.prevent="handleEmailLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <button @click="emailSignIn = false">Back</button>
    </div>
    <div v-else>
      <button class="sign-in-button" @click="emailSignIn = true">
        Email Sign In
      </button>
      <GoogleSignInButton
        @success="handleGoogleLogin"
        @error="handleLoginError"
      ></GoogleSignInButton>
    </div>
  </div>
</template>

<script setup>
import { GoogleSignInButton } from "vue3-google-signin";

const store = useStore();
const emailSignIn = ref(false);
const email = ref("");
const password = ref("");

const handleEmailLogin = async () => {
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    console.log("JWT Token from email sign in:", response.token);
    store.setToken(response.token);
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const handleGoogleLogin = async (response) => {
  const { credential } = response;
  if (credential) {
    try {
      const response = await $fetch("/api/auth/google-login", {
        method: "POST",
        body: { token: credential },
      });
      console.log("JWT Token from Google sign in:", response.token);
      store.setToken(response.token);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  }
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};
</script>

<style>
.sign-in-button {
  width: 5rem;
  /* height: 2rem; */
  color: black;
  background: white;
}
</style>
