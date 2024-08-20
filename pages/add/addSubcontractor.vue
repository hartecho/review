<template>
  <div class="wrapper">
    <h1>Add Subcontractor</h1>

    <div class="content">
      <div class="left">
        <div class="input-wrapper">
          <input type="text" v-model="subcontractor.company" placeholder=" " />
          <label>Company</label>
        </div>

        <div class="operating-states">
          <label>Select all states this subcontractor operates in:</label>
          <ProfileDropdown
            :items="states"
            :selected-items="subcontractor.operatingStates"
            @update:selectedItems="updateOperatingStates"
            label="Select Operating States"
          />
        </div>

        <div class="tags">
          <label>Select all services provided by this subcontractor:</label>
          <ProfileDropdown
            :items="tagDescriptions"
            :selected-items="subcontractor.tags"
            @update:selectedItems="updateTags"
            label="Select Job Types"
          />
        </div>

        <!-- New field for specifying Group or Individual -->
        <div class="input-wrappe">
          <label class="individual-group-label"
            >Is this subcontractor an individual or a group?</label
          >
          <div class="individual-group-options">
            <label class="option">
              <input
                type="radio"
                v-model="subcontractor.isIndividual"
                :value="false"
              />
              Group
            </label>
            <label class="option">
              <input
                type="radio"
                v-model="subcontractor.isIndividual"
                :value="true"
              />
              Individual
            </label>
          </div>
        </div>

        <div class="final-buttons">
          <SubcomponentsLoadingButton
            :isLoading="isLoading"
            text="Add Subcontractor"
            @click="addSubcontractor"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { tagDescriptions } from "~/utils/tagDescriptions.js";
import { states } from "/utils/states.js";

const router = useRouter();
const isLoading = ref(false);

const subcontractor = ref({
  company: "",
  isIndividual: false, // Set the default to Group (false)
  operatingStates: [],
  tags: [],
});

const isFormValid = computed(() => {
  return (
    subcontractor.value.company &&
    subcontractor.value.isIndividual !== null && // Ensure individual or group is selected
    subcontractor.value.operatingStates.length > 0 &&
    subcontractor.value.tags.length > 0
  );
});

const updateOperatingStates = (states) => {
  subcontractor.value.operatingStates = states;
};

const updateTags = (tags) => {
  subcontractor.value.tags = tags;
};

async function addSubcontractor() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/subcontractors", {
        method: "POST",
        body: subcontractor.value,
      });
      await fetchSubcontractorsAndCache();
      router.push(`/subcontractor/${response._id}`);
    } catch (error) {
      isLoading.value = false;
      alert("Error adding subcontractor: " + error.message);
      console.error("Error adding subcontractor:", error);
    }
  } else {
    isLoading.value = false;
    alert("Please fill out all required fields.");
  }
}

async function fetchSubcontractorsAndCache() {
  try {
    const subcontractors = await $fetch("/api/subcontractors");
    store.setSubcontractors(subcontractors);
  } catch (error) {
    console.log("Error: " + error);
  }
}

function resetForm() {
  subcontractor.value = {
    company: "",
    isIndividual: false, // Reset the individual or group selection to Group
    operatingStates: [],
    tags: [],
  };
}

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.wrapper {
  padding: 4rem 0;
  width: 100%;
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
  margin-bottom: 2rem;
  font-weight: 700;
}

.content {
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Allow content to wrap */
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

.individual-group-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.individual-group-options {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.individual-group-options label {
  font-weight: 500;
  color: #333;
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

.add-subcontractor-button {
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
