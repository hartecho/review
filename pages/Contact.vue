<template lang="html">
  <div class="content">
    <div class="hero-section">
      <div class="hero-text">
        <h1>Contact Us</h1>
        <p class="intro-message">We'd love to hear from you! Reach out through the form, and we'll get back to you shortly.</p>
      </div>
    </div>
    <div class="body-wrapper">
      <div class="contact-info-card">
        <div class="info-block">
          <h3>Email Us</h3>
          <p>support@subsource.org</p>
        </div>
        <!-- <div class="info-block">
          <h3>Call Us</h3>
          <p><a href="tel:+18017935456">+1 (801)-793-5456</a></p>
        </div> -->
      </div>
      <div class="contact-form-card">
        <div class="contact-form" v-if="showForm">
          <form @submit.prevent="submit">
            <div class="message" v-if="incomplete">
              <h4>*Please complete all fields before submitting.</h4>
            </div>
            <div class="message" v-if="invalidEmail">
              <h4>*Please enter a valid email address.</h4>
            </div>
            <div class="floating-label-group">
              <input type="text" name="Name" placeholder="Name" v-model="formData.name" />
              <label class="floating-label">Name</label>
            </div>
            <div class="floating-label-group">
              <input type="text" name="Email" placeholder="Email" v-model="formData.email" />
              <label class="floating-label">Email</label>
            </div>
            <div class="floating-label-group">
              <textarea name="Message" rows="8" cols="80" placeholder="Message" v-model="formData.message"></textarea>
              <label class="floating-label">Message</label>
            </div>
            <SubcomponentsLoadingButton :isLoading="isLoading" @click="submitForm()" />
          </form>
        </div>
        <div class="message-box success" v-if="showSuccess">
          <h2>Submission success! Thank you!</h2>
        </div>
        <div class="message-box error" v-if="showError">
          <h2>Sorry, there was an error submitting the form!</h2>
          <h3>Please try again or send us an email...</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title:
    "Contact Us | Subsource – Reach Out for questions regarding Reviews or Promotional Services",
  ogTitle:
    "Contact Us | Subsource – Reach Out for questions regarding Reviews or Promotional Services",
  description:
    "We'd love to hear from you! Contact Subsource through our form or email us at support@subsource.org for any inquiries regarding commercial contractor reviews.",
  ogDescription:
    "We'd love to hear from you! Contact Subsource through our form or email us at support@subsource.org for any inquiries regarding commercial contractor reviews.",
  ogImage: "/SSLogo.png",
  twitterCard: "/SSLogo.png",
});

const formData = ref({
  name: "",
  email: "",
  message: "",
});
const showForm = ref(true);
const showSuccess = ref(false);
const showError = ref(false);
const incomplete = ref(false);
const invalidEmail = ref(false);
const isLoading = ref(false);

const submitForm = async () => {
  if (
    formData.value.name === "" ||
    formData.value.email === "" ||
    formData.value.message === ""
  ) {
    invalidEmail.value = false;
    incomplete.value = true;
  } else if (
    !formData.value.email.includes("@") ||
    !formData.value.email.includes(".")
  ) {
    incomplete.value = false;
    invalidEmail.value = true;
  } else {
    isLoading.value = true;
    try {
      const response = await fetch(
        "https://8y7wjasxc7.execute-api.us-east-2.amazonaws.com/default/send-contact-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData.value),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        showForm.value = false;
        showSuccess.value = true;
      }
    } catch (error) {
      showForm.value = false;
      showError.value = true;
    } finally {
      isLoading.value = false;
    }
  }
};

const submit = () => {
  submitForm();
};
</script>

<style lang="css" scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.content {
  font-family: "Roboto", sans-serif;
  /* padding: 2rem 0; */
}

.hero-section {
  background: url("/IntroBG.jpg") no-repeat center center;
  background-size: cover;
  color: white;
  text-align: center;
  padding: 4rem 2rem;
  position: relative;
  height: 15rem;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0)
  ); */
  z-index: 1;
}

.hero-section h1,
.hero-section .intro-message {
  max-width: 1200px;
  margin: 0 auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 1);
  z-index: 2;
  text-align: left;
}

.hero-text {
  z-index: 2;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-section .intro-message {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

.body-wrapper {
  display: flex;
  justify-content: space-around;
  padding: 4rem;
  margin-top: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  gap: 5rem;
}

.contact-form-card {
  flex: 2;
  background: white;
  border-radius: 10px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  padding: 2rem;
}

.contact-info-card {
  flex: 1;
}

.contact-info-card h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.info-block {
  text-align: left;
  margin-bottom: 2rem;
  padding: 1rem 2rem;
  background: white;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  border-radius: 10px;
}

.info-block h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.info-block p {
  font-size: 1.2rem;
  color: black;
  margin: 0;
}

.info-block a {
  color: #007bff;
  text-decoration: none;
}

.info-block a:hover {
  text-decoration: underline;
}

.contact-form-card h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-form form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-form .floating-label-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.contact-form input,
.contact-form textarea {
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: #007bff;
  outline: none;
}

.floating-label {
  position: absolute;
  pointer-events: none;
  left: 0.75rem;
  top: 0.75rem;
  transition: 0.2s ease all;
  opacity: 0.6;
}

.contact-form input:focus ~ .floating-label,
.contact-form textarea:focus ~ .floating-label,
.contact-form input:not(:placeholder-shown) ~ .floating-label,
.contact-form textarea:not(:placeholder-shown) ~ .floating-label {
  top: -1rem;
  left: 0.75rem;
  font-size: 0.85rem;
  opacity: 1;
}

.message {
  color: red;
  text-align: center;
}

.message-box {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.success {
  background: #d4edda;
  color: #155724;
}

.error {
  background: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .body-wrapper {
    flex-direction: column;
    padding: 1rem;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .hero-section .intro-message {
    font-size: 1rem;
  }

  .contact-info-card,
  .contact-form-card {
    margin: 0 0 1rem 0;
  }

  .contact-info-card h2,
  .contact-form-card h2 {
    font-size: 1.5rem;
  }

  .info-block h3,
  .info-block p {
    font-size: 1rem;
  }

  .contact-form input,
  .contact-form textarea {
    font-size: 0.9rem;
  }
}
</style>

