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
        <input
          type="text"
          v-model="claimant.fullName"
          placeholder="Full Name"
        />
        <input
          type="email"
          v-model="claimant.email"
          placeholder="Email Address"
        />
        <input type="tel" v-model="claimant.phone" placeholder="Phone Number" />
        <input
          type="text"
          v-model="claimant.businessAddress"
          placeholder="Business Address"
        />
        <input
          type="tel"
          v-model="claimant.businessPhone"
          placeholder="Business Phone Number"
        />
        <input
          type="url"
          v-model="claimant.businessWebsite"
          placeholder="Business Website"
        />
        <input
          type="text"
          v-model="claimant.role"
          placeholder="Your Role/Title in Business"
        />
        <input
          type="number"
          v-model="claimant.yearsInBusiness"
          placeholder="Years in Business"
        />
        <textarea
          v-model="claimant.additionalComments"
          placeholder="Additional Comments"
        ></textarea>

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
        "Claim submitted successfully! Redirecting to the business page...";
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      setTimeout(() => {
        router.push(`/contractor/${route.query._id}`);
      }, 2000); // Redirect after 2 seconds
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
</script>
  
  <style scoped>
.wrapper {
  padding: 4rem 0;
  width: 90%;
  margin: 0 auto;
  min-height: 55rem;
  height: auto;
  font-family: "Roboto", sans-serif;
  /* background: url("/LoginBG.jpg") no-repeat center top; */
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

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="url"],
input[type="number"],
textarea {
  display: block;
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="tel"]:focus,
input[type="url"]:focus,
input[type="number"]:focus,
textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
  outline: none;
}

textarea {
  height: 100px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
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
  