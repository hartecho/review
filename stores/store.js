// stores/honeyStore.js
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const token = ref();

  const setToken = (newToken) => {
    token.value = newToken;
  };

  const logout = () => {
    token.value = null;
  }

  return {
    token,
    setToken,
    logout
  };
}, {
  persist: true
});
