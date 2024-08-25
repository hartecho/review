<template>
  <div class="inner-wrapper">
    <div class="input-wrapper">
      <input type="text" v-model="contractor.company" placeholder=" " />
      <label>Company</label>
    </div>

    <div class="operating-states">
      <label>Select all states this contractor operates in:</label>
      <ProfileDropdown
        :items="states"
        :selected-items="contractor.operatingStates"
        @update:selectedItems="updateOperatingStates"
        label="Select Operating States"
      />
    </div>

    <div class="final-buttons">
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        text="Add Contractor"
        @click="addContractor"
      />
    </div>
  </div>
</template>
  
<script setup>
import { states } from "/utils/states.js";

const router = useRouter();
const isLoading = ref(false);

const contractor = ref({
  company: "",
  operatingStates: [],
});

const isFormValid = computed(() => {
  return (
    contractor.value.company && contractor.value.operatingStates.length > 0
  );
});

const updateOperatingStates = (states) => {
  contractor.value.operatingStates = states;
};

async function addContractor() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/contractors", {
        method: "POST",
        body: contractor.value,
      });
      await fetchContractorsAndCache();
      router.push(`/contractor/${response._id}`);
    } catch (error) {
      isLoading.value = false;
      alert("Error adding contractor: " + error.message);
      console.error("Error adding contractor:", error);
    }
  } else {
    isLoading.value = false;
    alert("Please fill out all required fields.");
  }
}

async function fetchContractorsAndCache() {
  try {
    const contractors = await $fetch("/api/contractors");
    store.setContractors(contractors);
  } catch (error) {
    console.log("Error: " + error);
  }
}

function resetForm() {
  contractor.value = {
    company: "",
    operatingStates: [],
    tags: [],
  };
}
</script>
  
<style scoped>
.inner-wrapper {
  /* padding: 4rem 0; */
  width: 100%;
  /* margin: 0 auto; */
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

.input-wrapper {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-wrapper input[type="text"] {
  display: block;
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.input-wrapper input[type="text"]:focus {
  border-color: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
  outline: none;
}

.input-wrapper label {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  background: #fff;
  padding: 0 5px;
  color: #999;
  pointer-events: none;
}

.input-wrapper input:focus + label,
.input-wrapper input:not(:placeholder-shown) + label {
  top: -10px;
  left: 5px;
  font-size: 0.85rem;
  color: #4caf50;
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

.add-contractor-button {
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
  h1 {
    font-size: 2rem;
  }

  .input-wrapper input[type="text"] {
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

  .input-wrapper input[type="text"] {
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

