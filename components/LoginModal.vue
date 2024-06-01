<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" key="modal">
      <button @click="closeModal" class="close-button">×</button>
      <transition name="fade" mode="out-in">
        <div v-if="!emailSignIn" key="signInOptions">
          <h1>Join to Leave Reviews!</h1>
          <div class="form-wrapper">
            <div class="form-container">
              <h2>Login</h2>
              <div class="form-content">
                <button
                  class="button sign-in-button"
                  @click="emailSignIn = true"
                >
                  <img src="/EmailLogo.svg" alt="Email Logo" class="icon" />
                  Sign in with Email
                </button>
                <GoogleSignInButton
                  @success="handleGoogleLogin"
                  @error="handleLoginError"
                  class="google-button"
                ></GoogleSignInButton>
              </div>
            </div>
            <div class="form-container">
              <h2>Sign Up</h2>
              <form @submit.prevent="handleSignUp">
                <input
                  v-model="signUpEmail"
                  type="email"
                  placeholder="Email"
                  required
                  class="input"
                />
                <input
                  v-model="signUpPassword"
                  type="password"
                  placeholder="Password"
                  required
                  class="input"
                />
                <input
                  v-model="signUpName"
                  type="text"
                  placeholder="Name"
                  required
                  class="input"
                />
                <button type="submit" class="button sign-up-button">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
        <div v-else key="emailSignIn">
          <div class="login-form-container full-width">
            <h2>Login</h2>
            <form @submit.prevent="handleEmailLogin" class="login-form-content">
              <input
                v-model="email"
                type="email"
                placeholder="Email"
                required
                class="input"
              />
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                required
                class="input"
              />
              <button
                type="submit"
                :class="[
                  'button',
                  'login-button',
                  { enabled: email && password },
                ]"
                :disabled="!email || !password"
              >
                Login
              </button>
            </form>
            <img
              src="/BackArrow.svg"
              alt="Back Arrow"
              @click="emailSignIn = false"
              class="back-button"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { GoogleSignInButton } from "vue3-google-signin";
import { ref } from "vue";

const store = useStore();
const emailSignIn = ref(false);
const email = ref("");
const password = ref("");
const signUpEmail = ref("");
const signUpPassword = ref("");
const signUpName = ref("");
const showModal = ref(false);

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const handleEmailLogin = async () => {
  try {
    const response = await $fetch("/api/users/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    console.log("JWT Token from email sign in:", response.token);
    store.setToken(response.token);
    closeModal();
  } catch (error) {
    console.error("Login failed:", error);
  }
};

const handleGoogleLogin = async (response) => {
  const { credential } = response;
  if (credential) {
    try {
      const response = await $fetch("/api/users/google-login", {
        method: "POST",
        body: { token: credential },
      });
      console.log("JWT Token from Google sign in:", response.token);
      store.setToken(response.token);
      closeModal();
    } catch (error) {
      console.error("Google login failed:", error);
    }
  }
};

const handleLoginError = () => {
  console.error("Login failed");
};

const handleSignUp = async () => {
  try {
    const response = await $fetch("/api/users/register", {
      method: "POST",
      body: {
        email: signUpEmail.value,
        password: signUpPassword.value,
        name: signUpName.value,
      },
    });
    console.log("User registered:", response);
    await handleEmailLogin();
  } catch (error) {
    console.error("Sign-up failed:", error);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: url("/LoginBG.jpg") no-repeat center top;
  background-size: cover;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  text-align: center;
  position: relative;
  height: 30rem;
  width: 45rem;
  transition: transform 0.3s ease;
}

.modal:hover {
  transform: scale(1.02);
}

h1 {
  font-size: 2rem;
  margin-bottom: 3.5rem;
  color: white;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
}

.button {
  color: black;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
  width: 11.25rem;
  display: block;
}

.sign-in-button {
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.sign-in-button:hover {
  background: #0056b3;
}

.google-button {
  /* background: #fff; */
  color: #4285f4;
  transition: background 0.3s, color 0.3s;
}

.google-button:hover {
  color: #fff;
}

.login-button {
  background: #6c757d;
  transition: background 0.3s;
}

.login-button.enabled {
  background: #007bff;
}

.login-button:hover.enabled {
  background: #0056b3;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 24px;
  height: 24px;
  z-index: 10;
  transition: transform 0.3s;
}

.back-button:hover {
  transform: translateX(-2px);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
  z-index: 10;
  transition: color 0.3s;
}

.close-button:hover {
  color: #0056b3;
}

.form-wrapper {
  display: flex;
  justify-content: space-between;
}

.form-container {
  width: 48%;
  position: relative;
}

.login-form-container {
  padding: 2rem;
}

.form-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.login-form-content {
  width: 100%;
}

.full-width {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

* {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Standard syntax */
}
</style>
