<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button @click="closeModal" class="close-button">×</button>
      <h1>Login</h1>
      <transition name="fade">
        <div v-if="emailSignIn" key="emailSignIn" class="form-container">
          <form @submit.prevent="handleEmailLogin">
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
            <button type="submit" class="button">Login</button>
          </form>
          <button @click="emailSignIn = false" class="button back-button">
            Back
          </button>
        </div>
        <!-- OPTIONS -->
        <div v-else key="signInOptions" class="form-container">
          <button class="button sign-in-button" @click="emailSignIn = true">
            Sign in with Email
          </button>
          <GoogleSignInButton
            @success="handleGoogleLogin"
            @error="handleLoginError"
            class=""
          ></GoogleSignInButton>
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
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  max-width: 90%;
  text-align: center;
  position: relative;
  height: 30rem;
  width: 45rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.button {
  color: #fff;
  padding: 0.75rem 1.5rem;
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
}

.sign-in-button:hover {
  background: #0056b3;
}

.google-button {
  background: #fff;
  color: #4285f4;
  border: 1px solid #4285f4;
}

.google-button:hover {
  background: #f1f1f1;
}

.back-button {
  background: #6c757d;
}

.back-button:hover {
  background: #565e64;
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
}

.close-button:hover {
  color: #0056b3;
}

.form-container {
  min-height: 300px; /* Set the height to avoid content shift */
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
  