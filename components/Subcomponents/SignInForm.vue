<template>
  <div class="form-container">
    <h2>Sign in</h2>
    <div class="form-content">
      <button class="button sign-in-button" @click="onEmailSignIn">
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
</template>
  
  <script setup>
import { GoogleSignInButton } from "vue3-google-signin";

const emit = defineEmits(["emailSignIn", "googleLogin", "loginError"]);

const handleGoogleLogin = (response) => {
  emit("googleLogin", response);
};

const handleLoginError = (error) => {
  emit("loginError", error);
};

const onEmailSignIn = () => {
  emit("emailSignIn");
};
</script>
  
<style scoped>
.form-container {
  width: 48%;
  position: relative;
}

h2 {
  color: white;
}

.form-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  color: white;
  font-weight: bold;
}

.sign-in-button:hover {
  background: #0056b3;
}

.google-button {
  color: #4285f4;
  transition: background 0.3s, color 0.3s;
}

.google-button:hover {
  color: #fff;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

@media (max-width: 480px) {
  .form-container {
    width: 100%;
  }
  .form-content {
    min-height: 0;
    height: auto;
    padding: 2rem 0;
  }
}
</style>
