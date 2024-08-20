import { defineStore } from 'pinia';

export const useBusinessStore = defineStore('businessStore', () => {
  const contractors = ref([]);
  const subcontractors = ref([]);
  const suppliers = ref([]);
  const agencies = ref([]);
  const lastFetchTime = ref(0);

  const CACHE_DURATION = 1000 * 60 * 2; // 5 minutes

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
    contractors,
    subcontractors,
    suppliers,
    agencies,
    lastFetchTime,
    CACHE_DURATION,
    setContractors,
    setSubcontractors,
    setSuppliers,
    setAgencies,
  };
}, {
  persist: {
    key: 'business-store-key',
    storage: typeof localStorage !== 'undefined' ? localStorage : null,
    paths: ['contractors', 'subcontractors', 'suppliers', 'agencies', 'lastFetchTime'],
  },
});
