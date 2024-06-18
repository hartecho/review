<template>
  <div class="form-container">
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSignUp">
      <input
        v-model="signUpName"
        type="text"
        placeholder="Name"
        required
        class="input"
      />
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
        @input="validatePassword"
      />
      <SubcomponentsPasswordInput
        v-model="signUpPasswordConfirm"
        placeholder="Confirm Password"
      />
      <div class="password-requirements-toggle">
        <button
          type="button"
          @click="toggleRequirements"
          class="requirements-button"
        >
          Password Requirements?
        </button>
        <transition name="fade">
          <div v-if="showRequirements" class="password-requirements">
            <div
              :class="{
                valid: passwordValidLength,
                invalid: !passwordValidLength,
              }"
            >
              <span v-if="passwordValidLength">✔ </span>
              <span v-else>✘ </span>
              8 characters minimum
            </div>
            <div
              :class="{
                valid: passwordHasUppercase,
                invalid: !passwordHasUppercase,
              }"
            >
              <span v-if="passwordHasUppercase">✔ </span>
              <span v-else>✘ </span>
              At least one uppercase letter
            </div>
            <div
              :class="{ valid: passwordHasNumber, invalid: !passwordHasNumber }"
            >
              <span v-if="passwordHasNumber">✔ </span>
              <span v-else>✘ </span>
              At least one number
            </div>
          </div>
        </transition>
      </div>
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
import { ref, computed } from "vue";
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

const showRequirements = ref(false);

const passwordValidLength = ref(false);
const passwordHasUppercase = ref(false);
const passwordHasNumber = ref(false);

const validatePassword = () => {
  const password = signUpPassword.value;
  passwordValidLength.value = password.length >= 8;
  passwordHasUppercase.value = /[A-Z]/.test(password);
  passwordHasNumber.value = /[0-9]/.test(password);
};

const toggleRequirements = () => {
  showRequirements.value = !showRequirements.value;
};

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
    signUpName.value &&
    passwordValidLength.value &&
    passwordHasUppercase.value &&
    passwordHasNumber.value
  );
});
</script>

<style scoped>
.form-container {
  width: 48%;
  position: relative;
  margin: 0 auto; /* Center the form container */
  height: 25rem;
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

.password-requirements-toggle {
  margin-bottom: 1rem;
}

.password-requirements {
  background: rgba(0, 0, 0, 0.9);
  text-shadow: none;
  border-radius: 10px;
  padding: 1rem;
}

.password-requirements div {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.5rem;
}

.password-requirements .valid {
  color: green;
}

.password-requirements .invalid {
  color: red;
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

.requirements-button {
  width: 100%;
  background: white;
  border-radius: 5px;
  border: 1px solid black;
  cursor: pointer;
  min-height: 1.5rem;
  padding: 5px 0;
}

.requirements-button:hover {
  width: 100%;
  background: #f1f1f1;
  border-radius: 10px;
  border: 1px solid black;
  cursor: pointer;
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
    overflow-y: scroll;
  }
}
</style>
