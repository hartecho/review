<template>
  <div class="rating-filter">
    <label for="rating">Minimum Star Rating:</label>
    <select
      id="rating"
      :value="selectedRating"
      @change="$emit('update:selectedRating', $event.target.value)"
      class="rating-select"
    >
      <option value="0">All Ratings</option>
      <option value="4_and_above">4 Stars and Above</option>
      <option value="3">3 Stars</option>
      <option value="2">2 Stars</option>
      <option value="1">1 Star</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedRating: String,
});
</script>

<style scoped>
.rating-filter {
  margin-top: 10px;
}

label {
  color: white;
  margin-left: 0.5rem;
  margin-bottom: 1rem;
}

.rating-select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 25px;
}
</style>
