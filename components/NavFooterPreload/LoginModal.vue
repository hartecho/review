<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal" key="modal">
      <button @click="closeModal" class="close-button">×</button>
      <transition name="fade" mode="out-in">
        <div v-if="!emailSignIn" key="signInOptions">
          <h1>Join to Leave Reviews!</h1>
          <div class="form-wrapper">
            <SubcomponentsSignInForm
              @emailSignIn="handleEmailSignIn"
              @googleLogin="handleGoogleLogin"
              @loginError="handleLoginError"
            />
            <SubcomponentsSignUpForm
              :isLoading="isLoading"
              :signUpError="signUpError"
              @signUp="handleSignUp"
            />
          </div>
        </div>
        <div v-else key="emailSignIn">
          <SubcomponentsLoginForm
            :isLoading="isLoading"
            :loginError="loginError"
            @emailLogin="handleEmailLogin"
            @back="emailSignIn = false"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
const store = useStore();
const emailSignIn = ref(false);
const email = ref("");
const password = ref("");
const showModal = ref(false);
const isLoading = ref(false);

const loginError = ref({});
const signUpError = ref({});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const handleEmailSignIn = () => {
  emailSignIn.value = true;
};

const handleEmailLogin = async (loginData) => {
  isLoading.value = true;
  loginError.value = {};
  try {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: loginData.email, password: loginData.password },
    });
    console.log("JWT Token from email sign in:", response.token);
    store.setToken(response.token);
    store.setUser(response.user);
    closeModal();
    window.location.reload();
  } catch (error) {
    console.error("Login failed:", error);
    loginError.value = {
      general: error.data.message || "Invalid email or password",
    };
  } finally {
    isLoading.value = false;
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
      store.setUser(response.user);
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Google login failed:", error);
      loginError.value = {
        general: error.data.message || "Google login failed",
      };
    }
  }
};

const handleLoginError = (error) => {
  console.error("Login failed", error);
  loginError.value = { general: "Google login failed" };
};

const handleSignUp = async (signUpData) => {
  isLoading.value = true;
  signUpError.value = {};
  if (signUpData.password !== signUpData.passwordConfirm) {
    console.error("Passwords do not match");
    signUpError.value.passwordConfirm = "Passwords do not match";
    isLoading.value = false;
    return;
  }
  try {
    const response = await $fetch("/api/users", {
      method: "POST",
      body: {
        email: signUpData.email,
        password: signUpData.password,
        name: signUpData.name,
      },
    });
    console.log("User registered:", response);
    email.value = signUpData.email;
    password.value = signUpData.password;
    await handleEmailLogin({
      email: signUpData.email,
      password: signUpData.password,
    });
    window.location.reload();
  } catch (error) {
    isLoading.value = false;
    console.error("Sign-up failed:", error);
    signUpError.value.general =
      error.data.message || "Sign-up failed. Please try again.";
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
  height: 35rem;
  width: 50rem;
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

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
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
