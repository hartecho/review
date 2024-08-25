<template>
  <div class="dropdown" ref="dropdown" :class="{ 'two-columns': isTwoColumns }">
    <div class="dropdown-toggle" @click="handleDropdownClick">
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
    <div v-if="showDropdown" class="dropdown-menu">
      <button class="close-button" @click="closeDropdown">×</button>

      <!-- First Section -->
      <div
        v-if="firstSectionLabel && sortedFirstTagDescriptions"
        class="dropdown-section"
      >
        <h4>{{ firstSectionLabel }}</h4>
        <div
          v-for="(description, tag) in filteredFirstTagDescriptions"
          :key="tag"
          class="dropdown-item"
          @click="toggleCheckbox(tag, 'first')"
        >
          <input
            type="checkbox"
            :id="tag"
            :value="tag"
            :checked="selectedFirstTags?.includes(tag)"
            @click.stop
            readonly
          />
          <label :for="tag" class="tag-label">{{ description }}</label>
        </div>
      </div>

      <!-- Second Section -->
      <div
        v-if="secondSectionLabel && sortedSecondTagDescriptions"
        class="dropdown-section"
      >
        <h4>{{ secondSectionLabel }}</h4>
        <div
          v-for="(description, tag) in filteredSecondTagDescriptions"
          :key="tag"
          class="dropdown-item"
          @click="toggleCheckbox(tag, 'second')"
        >
          <input
            type="checkbox"
            :id="tag"
            :value="tag"
            :checked="selectedSecondTags?.includes(tag)"
            @click.stop
            readonly
          />
          <label :for="tag" class="tag-label">{{ description }}</label>
        </div>
      </div>

      <!-- Third Section -->
      <div
        v-if="thirdSectionLabel && sortedThirdTagDescriptions"
        class="dropdown-section"
      >
        <h4>{{ thirdSectionLabel }}</h4>
        <div
          v-for="(description, tag) in filteredThirdTagDescriptions"
          :key="tag"
          class="dropdown-item"
          @click="toggleCheckbox(tag, 'third')"
        >
          <input
            type="checkbox"
            :id="tag"
            :value="tag"
            :checked="selectedThirdTags?.includes(tag)"
            @click.stop
            readonly
          />
          <label :for="tag" class="tag-label">{{ description }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watchEffect } from "vue";

const props = defineProps({
  selectedFirstTags: Array,
  selectedSecondTags: Array,
  selectedThirdTags: Array,
  firstTagDescriptions: Object,
  secondTagDescriptions: Object,
  thirdTagDescriptions: Object,
  firstSectionLabel: String,
  secondSectionLabel: String,
  thirdSectionLabel: String, // New prop for the third category
});

const emit = defineEmits([
  "update:selectedFirstTags",
  "update:selectedSecondTags",
  "update:selectedThirdTags", // New emit for the third category
]);

const showDropdown = ref(false); // Manages the dropdown's open/close state
const filterText = ref(""); // Text used to filter the dropdown items
const dropdown = ref(null);
const filterInput = ref(null);
const isTwoColumns = ref(false); // State to manage column layout

const sortedFirstTagDescriptions = computed(() => {
  return props.firstTagDescriptions
    ? Object.keys(props.firstTagDescriptions)
        .sort((a, b) =>
          props.firstTagDescriptions[a].localeCompare(
            props.firstTagDescriptions[b]
          )
        )
        .reduce((sorted, key) => {
          sorted[key] = props.firstTagDescriptions[key];
          return sorted;
        }, {})
    : null;
});

const sortedSecondTagDescriptions = computed(() => {
  return props.secondTagDescriptions
    ? Object.keys(props.secondTagDescriptions)
        .sort((a, b) =>
          props.secondTagDescriptions[a].localeCompare(
            props.secondTagDescriptions[b]
          )
        )
        .reduce((sorted, key) => {
          sorted[key] = props.secondTagDescriptions[key];
          return sorted;
        }, {})
    : null;
});

const sortedThirdTagDescriptions = computed(() => {
  return props.thirdTagDescriptions
    ? Object.keys(props.thirdTagDescriptions)
        .sort((a, b) =>
          props.thirdTagDescriptions[a].localeCompare(
            props.thirdTagDescriptions[b]
          )
        )
        .reduce((sorted, key) => {
          sorted[key] = props.thirdTagDescriptions[key];
          return sorted;
        }, {})
    : null;
});

// Computed property to filter the first section based on filterText
const filteredFirstTagDescriptions = computed(() => {
  return sortedFirstTagDescriptions.value
    ? Object.fromEntries(
        Object.entries(sortedFirstTagDescriptions.value).filter(([key, desc]) =>
          desc.toLowerCase().includes(filterText.value.toLowerCase())
        )
      )
    : {};
});

// Computed property to filter the second section based on filterText
const filteredSecondTagDescriptions = computed(() => {
  return sortedSecondTagDescriptions.value
    ? Object.fromEntries(
        Object.entries(sortedSecondTagDescriptions.value).filter(
          ([key, desc]) =>
            desc.toLowerCase().includes(filterText.value.toLowerCase())
        )
      )
    : {};
});

// Computed property to filter the third section based on filterText
const filteredThirdTagDescriptions = computed(() => {
  return sortedThirdTagDescriptions.value
    ? Object.fromEntries(
        Object.entries(sortedThirdTagDescriptions.value).filter(([key, desc]) =>
          desc.toLowerCase().includes(filterText.value.toLowerCase())
        )
      )
    : {};
});

const toggleCheckbox = (tag, section) => {
  if (section === "first" && props.selectedFirstTags) {
    const newTags = props.selectedFirstTags.includes(tag)
      ? props.selectedFirstTags.filter((t) => t !== tag)
      : [...props.selectedFirstTags, tag];
    emit("update:selectedFirstTags", newTags);
  } else if (section === "second" && props.selectedSecondTags) {
    const newTags = props.selectedSecondTags.includes(tag)
      ? props.selectedSecondTags.filter((t) => t !== tag)
      : [...props.selectedSecondTags, tag];
    emit("update:selectedSecondTags", newTags);
  } else if (section === "third" && props.selectedThirdTags) {
    const newTags = props.selectedThirdTags.includes(tag)
      ? props.selectedThirdTags.filter((t) => t !== tag)
      : [...props.selectedThirdTags, tag];
    emit("update:selectedThirdTags", newTags);
  }
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    closeDropdown();
  }
};

const handleDropdownClick = () => {
  showDropdown.value = true;
  nextTick(() => {
    filterInput.value.focus(); // Automatically focus the input field
  });
};

const closeDropdown = () => {
  showDropdown.value = false;
  filterText.value = ""; // Reset filter text when closing the dropdown
};

const buttonText = computed(() => {
  const firstSelectedText = props.selectedFirstTags
    ?.map((tag) => props.firstTagDescriptions[tag])
    .join(", ");
  const secondSelectedText = props.selectedSecondTags
    ?.map((tag) => props.secondTagDescriptions[tag])
    .join(", ");
  const thirdSelectedText = props.selectedThirdTags
    ?.map((tag) => props.thirdTagDescriptions[tag])
    .join(", ");

  const selectedTexts = [
    firstSelectedText,
    secondSelectedText,
    thirdSelectedText,
  ]
    .filter((text) => text)
    .join(", ");

  return selectedTexts || "Select Job Types";
});

const checkColumnLayout = () => {
  // Check if the dropdown width exceeds a threshold, e.g., 400px
  if (dropdown.value && dropdown.value.offsetWidth > 400) {
    isTwoColumns.value = true;
  } else {
    isTwoColumns.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  watchEffect(checkColumnLayout); // Recheck column layout whenever the component updates
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
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
  display: flex;
  flex-wrap: wrap;
}

.dropdown.two-columns .dropdown-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.dropdown-section {
  width: 100%;
  margin-bottom: 15px;
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

.tag-label {
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

h4 {
  color: white;
  margin-bottom: 10px;
}
</style>
