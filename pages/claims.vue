<template>
  <div class="claims-wrapper">
    <h1>Claims</h1>
    <ul class="claims-list">
      <li v-for="claim in sortedClaims" :key="claim._id" class="claim-item">
        <div class="claim-details">
          <p class="business-name">{{ claim.businessName }}</p>
          <p class="claim-date">
            {{ new Date(claim.createdAt).toLocaleDateString() }}
          </p>
        </div>
        <div class="claim-info">
          <p><strong>Full Name:</strong> {{ claim.fullName }}</p>
          <p><strong>Email:</strong> {{ claim.email }}</p>
          <p><strong>Phone:</strong> {{ claim.phone }}</p>
          <p><strong>Business Address:</strong> {{ claim.businessAddress }}</p>
          <p><strong>Business Phone:</strong> {{ claim.businessPhone }}</p>
          <p>
            <strong>Business Website:</strong>
            <a :href="claim.businessWebsite" target="_blank">{{
              claim.businessWebsite
            }}</a>
          </p>
          <p><strong>Role:</strong> {{ claim.role }}</p>
          <p><strong>Years in Business:</strong> {{ claim.yearsInBusiness }}</p>
          <p v-if="claim.additionalComments">
            <strong>Additional Comments:</strong> {{ claim.additionalComments }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";

const claims = ref([]);

const fetchClaims = async () => {
  try {
    const response = await $fetch("/api/claims", {
      method: "GET",
    });
    claims.value = response;
    console.log("claims: ", claims.value);
  } catch (error) {
    console.error("Error fetching claims:", error);
  }
};

onMounted(fetchClaims);

const sortedClaims = computed(() => {
  return claims.value.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
});

const emit = defineEmits(["hide-loading"]);
emit("hide-loading");
</script>
  
  <style scoped>
.claims-wrapper {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: "Roboto", sans-serif;
  color: black;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 2rem;
}

.claims-list {
  list-style-type: none;
  padding: 0;
}

.claim-item {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s;
}

.claim-item:hover {
  background-color: #f9f9f9;
}

.claim-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.business-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #007bff;
}

.claim-date {
  font-size: 1rem;
  color: #555;
}

.claim-info p {
  margin: 0.5rem 0;
}

.claim-info a {
  color: #007bff;
  text-decoration: none;
}

.claim-info a:hover {
  text-decoration: underline;
}
</style>
  