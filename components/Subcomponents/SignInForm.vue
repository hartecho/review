<template>
  <div class="form-container">
    <h2>Sign In</h2>
    <div class="form-content">
      <button class="button sign-in-button" @click="onEmailSignIn">
        <img src="/EmailLogo.svg" alt="Email Logo" class="icon" />
        Sign in with Email
      </button>
      <!-- Custom Google Sign-In Button -->
      <button class="button google-sign-in-button" @click="triggerGoogleSignIn">
        <img src="/GoogleLogo.svg" alt="Google Logo" class="icon" />
        Sign in with Google
      </button>
      <!-- Hidden Google Sign-In Element -->
      <div
        id="g_id_onload"
        :data-client_id="googleClientId"
        data-callback="handleCredentialResponse"
        data-auto_select="false"
        data-context="signin"
        data-itp_support="true"
        class="hidden"
      ></div>
      <div class="g_id_signin hidden" data-type="standard"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const config = useRuntimeConfig();
const emit = defineEmits([
  "emailSignIn",
  "googleLogin",
  "loginError",
  "closeModal",
]);

const googleClientId = config.public.GOOGLE_CLIENT_ID;

const onEmailSignIn = () => {
  emit("emailSignIn");
};

const triggerGoogleSignIn = () => {
  emit("closeModal");
  const googleSignInButton = document.querySelector(
    '.g_id_signin div[role="button"]'
  );
  if (googleSignInButton) {
    googleSignInButton.click();
  }
};

onMounted(() => {
  // Load Google Identity Services library
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  // Define the callback function for handling the sign-in response
  window.handleCredentialResponse = (response) => {
    emit("googleLogin", response);
  };
});
</script>

<style scoped>
.form-container {
  width: 48%;
  position: relative;
  margin: 0 auto;
  height: auto;
}

h2 {
  margin-bottom: 1.5rem;
  color: white;
  text-decoration: underline;
}

.form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.button {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.3s, transform 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.sign-in-button {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  font-weight: bold;
}

.sign-in-button:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004494 100%);
}

.google-sign-in-button {
  background: white;
  color: black;
  font-weight: bold;
  border: 1px solid #4285f4;
}

.google-sign-in-button:hover {
  background: #ff8310;
  color: white;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.hidden {
  display: none;
}

@media (max-width: 480px) {
  .form-container {
    width: 100%;
  }
  .form-content {
    min-height: 0;
    height: auto;
    padding: 1rem 0;
  }
}
</style>
