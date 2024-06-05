// stores/honeyStore.js
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const token = ref();
  const user = ref();

  const setToken = (newToken) => {
    token.value = newToken;
  };

  const setUser = (newUser) => {
    user.value = newUser;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    setToken,
    setUser,
    logout
  };
}, {
  persist: true
});
