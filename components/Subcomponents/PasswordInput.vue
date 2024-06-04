<template>
  <div class="password-input-wrapper">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="passwordVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      required
      class="input"
    />
    <span @click="togglePasswordVisibility" class="eye-icon">
      {{ passwordVisible ? "🙈" : "👁️" }}
    </span>
  </div>
</template>
  
  <script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
});

const passwordVisible = ref(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
</script>
  
  <style scoped>
.password-input-wrapper {
  position: relative;
  width: 100%;
}

.eye-icon {
  position: absolute;
  top: 35%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
  