<template>
  <div class="wrapper">
    <h1>Claim {{ claimant.businessName }}</h1>

    <p class="description">
      Successfully claiming this business will link an account of your choice to
      the business, allowing you to respond to reviews on
      {{ claimant.businessName }}'s page when you are logged in. Please provide
      the below information to begin the verification process.
    </p>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div class="content" v-else>
      <div class="left">
        <div class="input-wrapper">
          <input type="text" v-model="claimant.fullName" placeholder=" " />
          <label>Full Name</label>
        </div>
        <div class="input-wrapper">
          <input type="email" v-model="claimant.email" placeholder=" " />
          <label>Email Address</label>
        </div>
        <div class="input-wrapper">
          <input type="tel" v-model="claimant.phone" placeholder=" " />
          <label>Phone Number</label>
        </div>
        <div class="input-wrapper">
          <input
            type="text"
            v-model="claimant.businessAddress"
            placeholder=" "
          />
          <label>Business Address</label>
        </div>
        <div class="input-wrapper">
          <input type="tel" v-model="claimant.businessPhone" placeholder=" " />
          <label>Business Phone Number</label>
        </div>
        <div class="input-wrapper">
          <input
            type="url"
            v-model="claimant.businessWebsite"
            placeholder=" "
          />
          <label>Business Website</label>
        </div>
        <div class="input-wrapper">
          <input type="text" v-model="claimant.role" placeholder=" " />
          <label>Your Role/Title in Business</label>
        </div>
        <div class="input-wrapper">
          <input
            type="number"
            v-model="claimant.yearsInBusiness"
            placeholder=" "
          />
          <label>Years in Business</label>
        </div>
        <div class="input-wrapper">
          <textarea
            v-model="claimant.additionalComments"
            placeholder=" "
          ></textarea>
          <label>Additional Comments</label>
        </div>

        <div class="final-buttons">
          <SubcomponentsLoadingButton
            :isLoading="isLoading"
            text="Submit Claim"
            @click="submitClaim"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(false);
const successMessage = ref("");
const router = useRouter();
const route = useRoute();

const claimant = ref({
  businessName: route.query.company || "",
  fullName: "",
  email: "",
  phone: "",
  businessAddress: "",
  businessPhone: "",
  businessWebsite: "",
  role: "",
  yearsInBusiness: "",
  additionalComments: "",
});

const isFormValid = computed(() => {
  return (
    claimant.value.fullName &&
    claimant.value.email &&
    claimant.value.phone &&
    claimant.value.businessAddress &&
    claimant.value.businessPhone &&
    claimant.value.businessWebsite &&
    claimant.value.role &&
    claimant.value.yearsInBusiness
  );
});

async function submitClaim() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/claims", {
        method: "POST",
        body: claimant.value,
      });
      successMessage.value =
        "Claim submitted successfully! Redirecting to home page...";
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        router.push("/");
      }, 5000); // Redirect after 5 seconds
    } catch (error) {
      isLoading.value = false;
      alert("Error submitting claim: " + error.message);
      console.error("Error submitting claim:", error);
    }
  } else {
    isLoading.value = false;
    alert("Please fill out all required fields.");
  }
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.wrapper {
  padding: 4rem 0;
  width: 90%;
  margin: 0 auto;
  min-height: 55rem;
  height: auto;
  font-family: "Roboto", sans-serif;
  background-size: cover;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.description {
  text-align: center;
  font-size: 1.2rem;
  color: #555;
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.success-message {
  text-align: center;
  font-size: 1.5rem;
  color: green;
  margin-bottom: 2rem;
}

.content {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.left {
  width: 60%;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"],
.input-wrapper input[type="email"],
.input-wrapper input[type="tel"],
.input-wrapper input[type="url"],
.input-wrapper input[type="number"],
.input-wrapper textarea {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: none;
}

.input-wrapper input[type="text"]:focus,
.input-wrapper input[type="email"]:focus,
.input-wrapper input[type="tel"]:focus,
.input-wrapper input[type="url"]:focus,
.input-wrapper input[type="number"]:focus,
.input-wrapper textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 18px;
  left: 10px;
  padding: 0 5px;
  background: #fff;
  color: #999;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  pointer-events: none;
  transform: translateY(0);
  font-weight: normal;
}

.input-wrapper input:not(:placeholder-shown) + label,
.input-wrapper textarea:not(:placeholder-shown) + label,
.input-wrapper input:focus + label,
.input-wrapper textarea:focus + label {
  top: -18px;
  left: 5px;
  font-size: 0.75rem;
  color: #4caf50;
}

textarea {
  height: 100px;
  resize: none;
}

label {
  display: block;
  font-weight: 500;
  color: #333;
}

.final-buttons {
  text-align: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: center;
  }

  .left {
    width: 80%;
  }

  h1 {
    font-size: 2rem;
  }

  input,
  textarea {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  button {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .left {
    width: 100%;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  input,
  textarea {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  button {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
