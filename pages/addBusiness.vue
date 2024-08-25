<template>
  <div class="wrapper">
    <h1>Add {{ businessTypeLabel }}</h1>

    <div class="content">
      <div class="left">
        <label for="businessType">Select Business Type:</label>
        <select v-model="selectedBusinessType" @change="resetForm">
          <option value="contractor">Contractor</option>
          <option value="subcontractor">Subcontractor</option>
          <option value="supplier">Supplier</option>
          <option value="agency">Agency</option>
        </select>

        <div class="form-container">
          <BusinessInputAddAgency v-if="selectedBusinessType == 'agency'" />
          <BusinessInputAddContractor
            v-if="selectedBusinessType == 'contractor'"
          />
          <BusinessInputAddSubcontractor
            v-if="selectedBusinessType == 'subcontractor'"
          />
          <BusinessInputAddSupplier v-if="selectedBusinessType == 'supplier'" />
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";

// No need to import components, as they are auto-registered in Nuxt 3 based on file structure

const selectedBusinessType = ref("contractor"); // Default business type

// Mapping of business types to their respective form components based on the folder structure
const formComponents = {
  contractor: "BusinessInputAddContractor",
  subcontractor: "BusinessInputAddSubcontractor",
  supplier: "BusinessInputAddSupplier",
  agency: "BusinessInputAddAgency",
};

// Dynamic component rendering based on the selected business type
const currentFormComponent = computed(
  () => formComponents[selectedBusinessType.value]
);

// Label for the selected business type
const businessTypeLabel = computed(() => {
  return (
    selectedBusinessType.value.charAt(0).toUpperCase() +
    selectedBusinessType.value.slice(1)
  );
});

// Handle form submission from any of the form components
const handleFormSubmission = () => {
  // Implement any actions that should take place after form submission
};

// Reset form when business type changes
const resetForm = () => {
  // Optionally reset any other states related to the form
};

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

select {
  width: 100%;
  padding: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-container {
  width: 100%;
}

@media (max-width: 768px) {
  .left {
    padding: 1rem;
  }
}

/* You can add additional styles for responsiveness, etc. */
</style>
  