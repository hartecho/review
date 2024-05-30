<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchQuery"
      @focus="showList = true"
      @blur="hideList"
      @input="filterList"
      placeholder="Search contractors..."
      class="search-input"
    />
    <ul v-if="showList && filteredContractors.length" class="dropdown-list">
      <li
        v-for="contractor in filteredContractors"
        :key="contractor._id"
        class="dropdown-item"
        @click="goToContractorPage(contractor._id)"
      >
        <img :src="contractor.picture" alt="Picture" class="contractor-logo" />
        <div class="contractor-info">
          <h3>{{ contractor.name }}</h3>
          <p>{{ contractor.company }}</p>
          <p>{{ contractor.phone }}</p>
          <p>{{ contractor.email }}</p>
        </div>
      </li>
    </ul>
    <NuxtLink to="/contractor/editContractors" class="edit-button-link">
      <button class="edit-button">Edit Contractors</button>
    </NuxtLink>
  </div>
</template>
  
  <script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const searchQuery = ref("");
const showList = ref(false);
const router = useRouter();

const { data: contractors } = await useFetch("/api/contractors");

const filteredContractors = computed(() => {
  return contractors.value.filter(
    (contractor) =>
      contractor.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contractor.company.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function filterList() {
  showList.value = true;
}

function hideList() {
  setTimeout(() => {
    showList.value = false;
  }, 200);
}

function goToContractorPage(contractorId) {
  router.push(`/contractor/${contractorId}`);
}
</script>
  
  <style scoped>
.search-container {
  position: relative;
  width: 400px;
  margin: 0 auto;
  text-align: center;
  color: black;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.contractor-logo {
  width: 50px;
  height: 50px;
  margin-right: 12px;
}

.contractor-info {
  flex: 1;
}

.contractor-info h3 {
  margin: 0;
  font-size: 18px;
}

.contractor-info p {
  margin: 2px 0;
  font-size: 14px;
}
</style>
  