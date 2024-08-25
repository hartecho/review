<template>
  <div class="inner-wrapper">
    <input type="text" v-model="supplier.company" placeholder="Company" />

    <div class="operating-states">
      <label>Select all states this supplier operates in:</label>
      <SearchStateFilter
        :showDropdown="showStateDropdown"
        :selectedStates="supplier.operatingStates"
        :states="states"
        @toggleDropdown="toggleStateDropdown"
        @closeDropdown="closeStateDropdown"
        @update:selectedStates="updateOperatingStates"
      />
    </div>

    <div class="tags">
      <label>Select all services provided by this supplier:</label>
      <SearchJobTypeDropdown
        :showDropdown="showJobDropdown"
        :selectedFirstTags="supplier.selectedRoughInTags"
        :selectedSecondTags="supplier.selectedFinishTags"
        :selectedThirdTags="supplier.selectedGeneralTags"
        :firstTagDescriptions="roughInSupplierTagDescriptions"
        :secondTagDescriptions="finishSupplierTagDescriptions"
        :thirdTagDescriptions="generalSupplierTagDescriptions"
        firstSectionLabel="Rough-In Supplies"
        secondSectionLabel="Finish Supplies"
        thirdSectionLabel="General Supplies"
        @toggleDropdown="toggleJobDropdown"
        @closeDropdown="closeJobDropdown"
        @update:selectedFirstTags="updateSelectedRoughInTags"
        @update:selectedSecondTags="updateSelectedFinishTags"
        @update:selectedThirdTags="updateSelectedGeneralTags"
      />
    </div>

    <div class="final-buttons">
      <SubcomponentsLoadingButton
        :isLoading="isLoading"
        text="Add Supplier"
        @click="addSupplier"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  roughInSupplierTagDescriptions,
  finishSupplierTagDescriptions,
  generalSupplierTagDescriptions,
} from "~/utils/tagDescriptions.js";
import { states } from "~/utils/states.js";

const router = useRouter();
const isLoading = ref(false);

const supplier = ref({
  company: "",
  operatingStates: [],
  selectedRoughInTags: [],
  selectedFinishTags: [],
  selectedGeneralTags: [],
  tags: [],
});

const showJobDropdown = ref(false);
const showStateDropdown = ref(false);

const isFormValid = computed(() => {
  return (
    supplier.value.company &&
    supplier.value.operatingStates.length > 0 &&
    supplier.value.tags.length > 0
  );
});

const updateOperatingStates = (states) => {
  supplier.value.operatingStates = states;
};

const updateSelectedRoughInTags = (tags) => {
  supplier.value.selectedRoughInTags = tags;
  updateTags();
};

const updateSelectedFinishTags = (tags) => {
  supplier.value.selectedFinishTags = tags;
  updateTags();
};

const updateSelectedGeneralTags = (tags) => {
  supplier.value.selectedGeneralTags = tags;
  updateTags();
};

const updateTags = () => {
  supplier.value.tags = [
    ...supplier.value.selectedRoughInTags,
    ...supplier.value.selectedFinishTags,
    ...supplier.value.selectedGeneralTags,
  ];
};

async function addSupplier() {
  isLoading.value = true;
  if (isFormValid.value) {
    try {
      const response = await $fetch("/api/suppliers", {
        method: "POST",
        body: supplier.value,
      });
      await fetchSuppliersAndCache();
      router.push(`/supplier/${response._id}`);
    } catch (error) {
      isLoading.value = false;
      alert("Error adding supplier: " + error.message);
      console.error("Error adding supplier:", error);
    }
  } else {
    isLoading.value = false;
    alert("Please fill out all required fields.");
  }
}

async function fetchSuppliersAndCache() {
  try {
    const suppliers = await $fetch("/api/suppliers");
    store.setSuppliers(suppliers);
  } catch (error) {
    console.log("Error: " + error);
  }
}

function resetForm() {
  supplier.value = {
    company: "",
    operatingStates: [],
    selectedRoughInTags: [],
    selectedFinishTags: [],
    selectedGeneralTags: [],
    tags: [],
  };
}

function toggleJobDropdown() {
  showJobDropdown.value = !showJobDropdown.value;
}

function closeJobDropdown() {
  showJobDropdown.value = false;
}

function toggleStateDropdown() {
  showStateDropdown.value = !showStateDropdown.value;
}

function closeStateDropdown() {
  showStateDropdown.value = false;
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

label {
  display: inline-block;
  margin-bottom: 0.5rem;
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

  button {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
