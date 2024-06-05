<template>
  <div class="dropdown" ref="dropdown">
    <button @click="toggleDropdown" class="dropdown-button">
      Select Job Types
    </button>
    <div v-if="showDropdown" class="dropdown-menu">
      <div
        v-for="(description, tag) in sortedTagDescriptions"
        :key="tag"
        class="dropdown-item"
      >
        <input
          type="checkbox"
          :id="tag"
          :value="tag"
          :checked="selectedTags.includes(tag)"
          @change="updateSelectedTags(tag)"
        />
        <label :for="tag">{{ description }}</label>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  showDropdown: Boolean,
  selectedTags: Array,
  tagDescriptions: Object,
});

const emit = defineEmits(["toggleDropdown", "update:selectedTags"]);

const sortedTagDescriptions = computed(() => {
  return Object.keys(props.tagDescriptions)
    .sort((a, b) =>
      props.tagDescriptions[a].localeCompare(props.tagDescriptions[b])
    )
    .reduce((sorted, key) => {
      sorted[key] = props.tagDescriptions[key];
      return sorted;
    }, {});
});

const updateSelectedTags = (tag) => {
  const newTags = props.selectedTags.includes(tag)
    ? props.selectedTags.filter((t) => t !== tag)
    : [...props.selectedTags, tag];
  emit("update:selectedTags", newTags);
};

const dropdown = ref(null);

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    emit("toggleDropdown");
  }
};

const toggleDropdown = () => {
  emit("toggleDropdown");
};

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
}

.dropdown-button::after {
  content: "▼";
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
  z-index: 10;
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
</style>
  