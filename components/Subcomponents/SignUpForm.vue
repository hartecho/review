<template>
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
      <SubcomponentsPasswordInput
        v-model="signUpPassword"
        placeholder="Password"
      />
      <SubcomponentsPasswordInput
        v-model="signUpPasswordConfirm"
        placeholder="Confirm Password"
      />
      <input
        v-model="signUpName"
        type="text"
        placeholder="Name"
        required
        class="input"
      />
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        :disabled="!isFormValid"
        @click="handleSignUp"
        text="Sign Up"
        class="sign-up-button"
      />
      <transition name="fade">
        <div v-if="signUpError.general" class="error-message">
          {{ signUpError.general }}
        </div>
      </transition>
    </form>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  signUpError: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["signUp"]);

const signUpEmail = ref("");
const signUpPassword = ref("");
const signUpPasswordConfirm = ref("");
const signUpName = ref("");

const handleSignUp = async () => {
  if (!isFormValid.value) {
    signUpError.value = { general: "Please fill in all fields correctly." };
    return;
  }
  emit("signUp", {
    email: signUpEmail.value,
    password: signUpPassword.value,
    passwordConfirm: signUpPasswordConfirm.value,
    name: signUpName.value,
  });
};

const isPasswordMatch = computed(() => {
  return signUpPassword.value === signUpPasswordConfirm.value;
});

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(signUpEmail.value);
});

const isFormValid = computed(() => {
  return (
    signUpEmail.value &&
    isEmailValid.value &&
    signUpPassword.value &&
    signUpPasswordConfirm.value &&
    isPasswordMatch.value &&
    signUpName.value
  );
});
</script>
  
<style scoped>
.form-container {
  width: 48%;
  position: relative;
  margin: 0 auto; /* Center the form container */
}

h2 {
  margin-bottom: 1.5rem;
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
  color: white;
  background-color: red;
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  border-radius: 5px;
  opacity: 1;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.error-message-enter-active,
.error-message-leave-active {
  opacity: 1;
}

.sign-up-button {
  width: 100%;
}

.sign-up-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .form-container {
    width: 100%;
  }
}
</style>
