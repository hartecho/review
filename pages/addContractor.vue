<template>
  <div class="wrapper">
    <h1>Add Contractor</h1>

    <div class="content">
      <div class="left">
        <input type="text" v-model="contractor.company" placeholder="Company" />

        <div class="operating-states">
          <label>Select all states this contractor operates in:</label>
          <ProfileDropdown
            :items="availableStates"
            :selected-items="contractor.operatingStates"
            @update:selectedItems="updateOperatingStates"
            label="Select Operating States"
          />
        </div>

        <div class="tags">
          <label>Select all services provided by this contractor:</label>
          <ProfileDropdown
            :items="tagDescriptionsArray"
            :selected-items="contractor.tags"
            @update:selectedItems="updateTags"
            label="Select Job Types"
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
    </div>
  </div>
</template>
  
<script setup>
import { tagDescriptions } from "~/utils/tagDescriptions.js";
const router = useRouter();
const isLoading = ref(false);

const tagDescriptionsArray = Object.entries(tagDescriptions).map(
  ([key, value]) => ({
    enum: key,
    description: value,
  })
);

const contractor = ref({
  company: "",
  operatingStates: [],
  tags: [],
});

const availableStates = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

const isFormValid = computed(() => {
  return (
    contractor.value.company &&
    contractor.value.operatingStates.length > 0 &&
    contractor.value.tags.length > 0
  );
});

const updateOperatingStates = (states) => {
  contractor.value.operatingStates = states;
};

const updateTags = (tags) => {
  contractor.value.tags = tags;
};

async function addContractor() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/contractors", {
        method: "POST",
        body: contractor.value,
      });
      // console.log("response: " + JSON.stringify(response));
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

function resetForm() {
  contractor.value = {
    company: "",
    operatingStates: [],
    tags: [],
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
  background: url("/LoginBG.jpg") no-repeat center top;
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
  padding: 2rem;
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
