<template>
  <div class="rating-filter">
    <label for="rating">Minimum Star Rating:</label>
    <select
      id="rating"
      :value="selectedRating"
      @change="$emit('update:selectedRating', Number($event.target.value))"
      class="rating-select"
    >
      <option value="0">All Ratings</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  selectedRating: Number,
});
</script>
  
  <style scoped>
.rating-filter {
  margin-top: 10px;
}

.rating-select {
  margin-left: 10px;
  padding: 5px;
  border-radius: 25px;
}
</style>
  