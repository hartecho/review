<template>
  <input
    type="text"
    :value="searchQuery"
    @input="$emit('update:searchQuery', $event.target.value)"
    placeholder="Search contractors by name, operating states, or job types..."
    class="search-input"
  />
</template>
  
  <script setup>
const props = defineProps({
  searchQuery: String,
});
</script>
  
  <style scoped>
.search-input {
  width: 100%;
  /* max-width: 600px; */
  padding: 10px 20px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
}
</style>
  