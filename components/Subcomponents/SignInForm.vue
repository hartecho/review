<template>
  <div class="form-container">
    <h2>Sign In</h2>
    <div class="form-content">
      <!-- Button to trigger email sign-in -->
      <button class="button sign-in-button" @click="onEmailSignIn">
        <img src="/EmailLogo.svg" alt="Email Logo" class="icon" />
        Sign in with Email
      </button>

      <!-- Google Sign-In Button -->
      <GoogleSignInButton
        @success="handleGoogleLogin"
        @error="handleLoginError"
        class="google-button"
      ></GoogleSignInButton>

      <!-- reCAPTCHA widget only shows if Google sign-in is successful -->
      <!-- <div class="recap">
        <form action="?" method="POST">
          <div
            class="g-recaptcha"
            :data-sitekey="config.public.RECAPTCHA_SITE_KEY"
          ></div>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { GoogleSignInButton } from "vue3-google-signin";

const config = useRuntimeConfig(); // Access runtime configuration for reCAPTCHA site key
const showRecaptcha = ref(false); // Track whether to show reCAPTCHA
const googleResponse = ref(null); // Store Google sign-in response

// Dynamically load reCAPTCHA script using useHead
// useHead({
//   script: [
//     {
//       src: "https://www.google.com/recaptcha/api.js",
//       async: true,
//       defer: true,
//     },
//   ],
// });

const emit = defineEmits(["emailSignIn", "googleLogin", "loginError"]);

const handleGoogleLogin = (response) => {
  // googleResponse.value = response; // Store Google sign-in response
  const element = document.querySelector(".recap");
  if (element) {
    element.classList.add(".show");
  }
};

// reCAPTCHA success callback
const onRecaptchaSuccess = (token) => {
  // Proceed with Google login after reCAPTCHA success
  emit("googleLogin", googleResponse.value);
};

const handleLoginError = (error) => {
  emit("loginError", error); // Emit login error
};

const onEmailSignIn = () => {
  emit("emailSignIn"); // Emit email sign-in event
};
</script>
  
<style scoped>
.form-container {
  width: 48%;
  position: relative;
}

h2 {
  color: white;
  text-decoration: underline;
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
  text-shadow: none;
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

.recap {
  display: none;
}

.recap.show {
  display: inline-block;
}

.g-recaptcha {
  /* height: 40rem;
  width: 40rem;
  z-index: 10000;
  background: blue; */
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
