<template>
  <div class="dropdown" ref="dropdown">
    <button
      @click="toggleDropdown"
      :class="['dropdown-button', { active: showDropdown }]"
    >
      <span>{{ buttonText }}</span>
      <span class="dropdown-arrow">▼</span>
    </button>
    <div v-if="showDropdown" class="dropdown-menu">
      <button class="close-button" @click="closeDropdown">×</button>
      <div
        v-for="stateKey in sortedStateKeys"
        :key="stateKey"
        class="dropdown-item"
      >
        <input
          type="checkbox"
          :id="stateKey"
          :value="stateKey"
          :checked="selectedStates.includes(stateKey)"
          @change="updateSelectedStates(stateKey)"
        />
        <label :for="stateKey">{{ props.states[stateKey] }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showDropdown: Boolean,
  selectedStates: Array, // Array of selected state keys
  states: Object, // Object where keys are state codes and values are state names
});

const emit = defineEmits([
  "toggleDropdown",
  "closeDropdown",
  "update:selectedStates",
]);

// Sorted array of state keys based on their names
const sortedStateKeys = computed(() => {
  return Object.keys(props.states).sort((a, b) =>
    props.states[a].localeCompare(props.states[b])
  );
});

const updateSelectedStates = (stateKey) => {
  // Toggles the state key in the selectedStates array
  const newStates = props.selectedStates.includes(stateKey)
    ? props.selectedStates.filter((s) => s !== stateKey)
    : [...props.selectedStates, stateKey];
  emit("update:selectedStates", newStates);
};

const dropdown = ref(null);

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    emit("closeDropdown");
  }
};

const toggleDropdown = () => {
  emit("toggleDropdown");
};

const closeDropdown = () => {
  emit("closeDropdown");
};

// Compute button text to display selected states
const buttonText = computed(() => {
  if (props.selectedStates.length === 0) {
    return "Select States";
  } else {
    return props.selectedStates
      .map((stateKey) => props.states[stateKey])
      .join(", ");
  }
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
}

.dropdown-button {
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: white;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.dropdown-button.active {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
}

.dropdown-arrow {
  font-size: 12px;
  margin-left: 10px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  border-radius: 10px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
}

.dropdown-menu input {
  margin-right: 0.5rem;
}

.dropdown-item {
  flex: 1 0 45%;
  margin: 5px;
  color: white;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
}
</style>
