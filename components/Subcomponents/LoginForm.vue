<template>
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
      <SubcomponentsPasswordInput v-model="password" placeholder="Password" />
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        :disabled="!isFormValid"
        @click="handleEmailLogin"
        text="Login"
      />
      <transition name="fade">
        <div v-if="loginError.general" class="error-message">
          {{ loginError.general }}
        </div>
      </transition>
    </form>
    <img
      :src="backArrowSrc"
      alt="Back Arrow"
      @click="handleBackClick"
      class="back-button"
    />
  </div>
</template>
  
  <script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  loginError: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["emailLogin", "back"]);

const email = ref("");
const password = ref("");

const handleEmailLogin = () => {
  emit("emailLogin", { email: email.value, password: password.value });
  password.value = "";
};

const handleBackClick = () => {
  emit("back");
};

const backArrowSrc = "/BackArrow.svg";

const isFormValid = computed(() => {
  return email.value && password.value;
});
</script>
  
  <style scoped>
.login-form-container {
  padding: 2rem;
}

h2 {
  color: white;
  margin-bottom: 2rem;
}

.full-width {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
  color: white;
  background-color: red;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 25%;
  border-radius: 5px;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.error-message-enter-active,
.error-message-leave-active {
  opacity: 1;
}

.back-button {
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 2rem;
  left: 2rem;
  width: 24px;
  height: 24px;
  z-index: 10;
  transition: transform 0.3s;
}

.back-button:hover {
  transform: translateX(-2px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
  