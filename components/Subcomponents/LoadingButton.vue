<template>
  <button
    :disabled="isLoading || disabled"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="!isLoading">{{ text }}</span>
    <span v-else class="spinner"></span>
  </button>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "Submit",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  class: {
    type: [String, Array, Object],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (!props.disabled) {
    emit("click");
  }
};

const buttonClasses = computed(() => {
  return ["loading-button", props.class];
});
</script>

<style scoped>
.loading-button {
  position: relative;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.loading-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.loading-button:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
