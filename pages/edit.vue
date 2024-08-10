<template>
  <div class="nav-container">
    <button
      @click="navigateTo('/contractor/editContractor')"
      class="nav-button"
    >
      Edit Contractor
    </button>
    <button
      @click="navigateTo('/subcontractor/editSubcontractor')"
      class="nav-button"
    >
      Edit Subcontractor
    </button>
    <button @click="navigateTo('/supplier/editSupplier')" class="nav-button">
      Edit Supplier
    </button>
    <button @click="navigateTo('/agency/editAgency')" class="nav-button">
      Edit Agency
    </button>
    <button @click="navigateTo('/user/editUser')" class="nav-button">
      Edit User
    </button>
  </div>
</template>
  
  <script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};
</script>
  
  <style scoped>
.nav-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.nav-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: #0056b3;
}
</style>
  