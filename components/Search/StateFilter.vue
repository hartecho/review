<template>
  <div class="dropdown" ref="dropdown">
    <div class="dropdown-toggle" @click="toggleDropdown">
      <span v-if="!showDropdown" class="toggle-text">{{ buttonText }}</span>
      <input
        v-else
        ref="filterInput"
        type="text"
        v-model="filterText"
        placeholder="Type to filter..."
        class="dropdown-input"
        @click.stop
      />
      <span class="dropdown-arrow">▼</span>
    </div>
    <div v-if="showDropdown" class="dropdown-menu two-columns">
      <button class="close-button" @click="closeDropdown">×</button>
      <div
        v-for="stateKey in filteredStateKeys"
        :key="stateKey"
        class="dropdown-item"
        @click.stop="updateSelectedStates(stateKey)"
      >
        <input
          type="checkbox"
          :id="stateKey"
          :checked="selectedStates.includes(stateKey)"
          readonly
        />
        <label :for="stateKey" class="item-label">{{ states[stateKey] }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const props = defineProps({
  selectedStates: {
    type: Array,
    default: () => [],
  },
  states: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:selectedStates"]);

const showDropdown = ref(false);
const filterText = ref("");
const filterInput = ref(null);
const dropdown = ref(null);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) {
    nextTick(() => {
      filterInput.value?.focus();
    });
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
    filterText.value = "";
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
  filterText.value = ""; // Reset filter text when closing the dropdown
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    closeDropdown();
    document.removeEventListener("click", handleClickOutside);
  }
};

const updateSelectedStates = (stateKey) => {
  const newSelectedStates = [...props.selectedStates];
  const index = newSelectedStates.indexOf(stateKey);
  if (index > -1) {
    newSelectedStates.splice(index, 1);
  } else {
    newSelectedStates.push(stateKey);
  }
  emit("update:selectedStates", newSelectedStates);
};

const filteredStateKeys = computed(() => {
  const search = filterText.value.toLowerCase();
  return Object.keys(props.states)
    .filter((key) => props.states[key].toLowerCase().includes(search))
    .sort((a, b) => props.states[a].localeCompare(props.states[b]));
});

const buttonText = computed(() => {
  if (props.selectedStates.length === 0) {
    return "Select States";
  }
  return props.selectedStates.map((key) => props.states[key]).join(", ");
});
</script>

<style scoped>
.dropdown {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.dropdown-toggle:hover,
.dropdown-toggle.active {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.toggle-text {
  pointer-events: none; /* Ensure the text does not intercept clicks */
  user-select: none; /* Prevent text selection */
}

.dropdown-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: transparent;
  color: black;
}

.dropdown-arrow {
  font-size: 12px;
  color: black;
  pointer-events: none; /* Ensure the arrow does not intercept clicks */
}

.dropdown-menu {
  position: absolute;
  top: 105%;
  left: 0;
  right: 0;
  background-color: rgba(30, 30, 30, 0.9);
  border: 1px solid #ccc;
  border-radius: 10px;
  max-height: 250px;
  overflow-y: auto;
  padding: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Creates two columns */
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  color: white;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.dropdown-item input {
  margin-right: 10px;
  pointer-events: none; /* Prevent the checkbox from intercepting clicks */
}

.item-label {
  pointer-events: none; /* Ensure clicks pass through the label */
  user-select: none; /* Prevent text selection */
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
