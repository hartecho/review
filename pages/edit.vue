<template>
  <div class="nav-container">
    <button
      @click="navigateTo('/contractor/editContractors')"
      class="nav-button"
    >
      Edit Contractors
    </button>
    <button
      @click="navigateTo('/subcontractor/editSubcontractors')"
      class="nav-button"
    >
      Edit Subcontractors
    </button>
    <button @click="navigateTo('/supplier/editSuppliers')" class="nav-button">
      Edit Suppliers
    </button>
    <button @click="navigateTo('/agency/editAgencies')" class="nav-button">
      Edit Agencies
    </button>
    <button @click="navigateTo('/blog/editBlogs')" class="nav-button">
      Edit Blogs
    </button>
    <button @click="navigateTo('/user/editUsers')" class="nav-button">
      Edit Users
    </button>
    <button @click="navigateTo('/review/editReviews')" class="nav-button">
      Edit Reviews
    </button>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateTo = (path) => {
  router.push(path);
};

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>

<style scoped>
.nav-container {
  padding: 2rem 2rem;
  height: 50rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.nav-button {
  width: 100%;
  padding: 15px 0;
  font-size: 1rem;
  background-color: #ff8210;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  background-color: #e65a00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
