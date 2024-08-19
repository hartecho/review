import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const token = ref();
  const user = ref();

  // Business data states
  const contractors = ref([]);
  const subcontractors = ref([]);
  const suppliers = ref([]);
  const agencies = ref([]);
  const lastFetchTime = ref(0);

  // Token and user management
  const setToken = (newToken) => {
    // console.log("Setting new token: " + newToken);
    token.value = newToken;
  };

  const setUser = (newUser) => {
    // console.log("Setting new user: " + newUser);
    user.value = newUser;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  }

  // Data fetching and caching logic
  const CACHE_DURATION = 1000 * 60 * 15; // Should be 15 minutes

  const setContractors = (newContractors) => {
    contractors.value = newContractors;
    lastFetchTime.value = Date.now();
  };

  const setSubcontractors = (newSubcontractors) => {
    subcontractors.value = newSubcontractors;
    lastFetchTime.value = Date.now();
  };

  const setSuppliers = (newSuppliers) => {
    suppliers.value = newSuppliers;
    lastFetchTime.value = Date.now();
  };

  const setAgencies = (newAgencies) => {
    agencies.value = newAgencies;
    lastFetchTime.value = Date.now();
  };

  return {
    token,
    user,
    lastFetchTime,
    contractors,
    subcontractors,
    suppliers,
    CACHE_DURATION,
    agencies,
    setToken,
    setUser,
    logout,
    setContractors,
    setSubcontractors,
    setSuppliers,
    setAgencies,
  };
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'my-store-key', // Custom key for storage in localStorage
        storage: typeof localStorage !== 'undefined' ? localStorage : null, // Safe access to localStorage
        paths: ['token', 'user'], // Optional: specify which state properties to persist
      },
    ],
  } // This will persist the store's state across page reloads
});
