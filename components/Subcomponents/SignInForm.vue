<template>
  <div class="form-container">
    <h2>Sign In</h2>
    <div class="form-content">
      <button class="button sign-in-button" @click="onEmailSignIn">
        <img src="/EmailLogo.svg" alt="Email Logo" class="icon" />
        Sign in with Email
      </button>
      <button class="button google-button" @click="onGoogleSignIn">
        <img src="/GoogleLogo.svg" alt="Google Logo" class="icon" />
        Sign in with Google
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const config = useRuntimeConfig();

const emit = defineEmits(["emailSignIn", "googleLogin", "loginError"]);

const onEmailSignIn = () => {
  emit("emailSignIn");
};

onMounted(() => {
  // Load Google Identity Services library
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

const onGoogleSignIn = () => {
  try {
    google.accounts.id.initialize({
      client_id: config.public.GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      use_fedcm_for_prompt: true, // Opt-in to FedCM API
    });

    google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment()) {
        console.error("Google Sign-In prompt skipped");
        emit("loginError", new Error("Google Sign-In prompt skipped"));
      }
    });
  } catch (error) {
    console.error("Google Sign-In initialization failed", error);
    emit("loginError", error);
  }
};

const handleGoogleLogin = (response) => {
  if (response.credential) {
    emit("googleLogin", response);
  } else {
    console.error("Google Sign-In failed");
    emit("loginError", new Error("Google Sign-In failed"));
  }
};
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

.google-button {
  background: white;
  border: 1px solid #4285f4;
  color: black;
  font-weight: bold;
}

.google-button:hover {
  background: #ff8310;
  text-shadow: 2px 2px 2px black;
  color: white;
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
    padding: 1rem 0;
  }
}
</style>
