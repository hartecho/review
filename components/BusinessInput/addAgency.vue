<template>
  <div class="inner-wrapper">
    <input type="text" v-model="agency.company" placeholder="Company" />

    <div class="operating-states">
      <label>Select all states this agency operates in:</label>
      <ProfileDropdown
        :items="states"
        :selected-items="agency.operatingStates"
        @update:selectedItems="updateOperatingStates"
        label="Select Operating States"
      />
    </div>

    <div class="final-buttons">
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        text="Add Agency"
        @click="addAgency"
      />
    </div>
  </div>
</template>
    
  <script setup>
import { states } from "/utils/states.js";

const router = useRouter();
const isLoading = ref(false);

const agency = ref({
  company: "",
  operatingStates: [],
});

const isFormValid = computed(() => {
  return agency.value.company && agency.value.operatingStates.length > 0;
});

const updateOperatingStates = (states) => {
  agency.value.operatingStates = states;
};

async function addAgency() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/agencies", {
        method: "POST",
        body: agency.value,
      });
      await fetchAgenciesAndCache();
      router.push(`/agency/${response._id}`);
    } catch (error) {
      isLoading.value = false;
      alert("Error adding agency: " + error.message);
      console.error("Error adding agency:", error);
    }
  } else {
    isLoading.value = false;
    alert("Please fill out all required fields.");
  }
}

async function fetchAgenciesAndCache() {
  try {
    const agencies = await $fetch("/api/agencies");
    store.setAgencies(agencies);
  } catch (error) {
    console.log("Error: " + error);
  }
}

function resetForm() {
  agency.value = {
    company: "",
    operatingStates: [],
  };
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
  background-size: cover;
  /* background-color: #f5f5f5; */
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
  font-weight: 700;
}

.content {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.left {
  width: 60%;
  background: #fff;
  padding: 0rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

input[type="text"] {
  display: block;
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
  outline: none;
}

.custom-select {
  position: relative;
  display: flex;
  flex-direction: column;
}

.select-selected {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 1rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
}

.select-selected:hover {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
}

.select-items {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 99;
  max-height: 200px;
  overflow-y: auto;
  transition: all 0.3s;
}

.select-items div {
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.select-items div:hover {
  background-color: #e0e0e0;
}

.select-items input {
  margin-right: 10px;
}

.select-hide {
  display: none;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.add-agency-button {
  background-color: #ff8210;
  border: none;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 1rem 0.5rem 0 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover {
  background-color: #e65a00;
  box-shadow: 0 4px 8px rgba(230, 90, 0, 0.2);
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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

  input[type="text"] {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .select-selected {
    padding: 0.8rem;
  }

  .select-items div {
    padding: 0.8rem;
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

  input[type="text"] {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  .select-selected {
    padding: 0.6rem;
  }

  .select-items div {
    padding: 0.6rem;
  }

  button {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
  