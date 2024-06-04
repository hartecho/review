<template>
  <div>
    <div v-for="review in reviews" :key="review._id" class="review">
      <h4>{{ review.reviewer.name }}</h4>
      <p>Rating: {{ review.rating }} / 5</p>
      <p>{{ review.comment }}</p>
      <p>
        Tags: {{ review.tags.map((tag) => tagDescriptions[tag]).join(", ") }}
      </p>
      <p class="date">{{ new Date(review.date).toLocaleDateString() }}</p>
    </div>
  </div>
</template>
  
  <script setup>
const props = defineProps({
  contractor: {
    type: Object,
    required: true,
  },
  tagDescriptions: {
    type: Object,
    required: true,
  },
});

const reviews = ref([]);

async function fetchReviews() {
  try {
    const response = await $fetch(
      `/api/reviews?contractor=${props.contractor._id}`
    );
    reviews.value = response;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }
}

onMounted(fetchReviews);
</script>
  
  <style scoped>
.review {
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
}

.review h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
}

.review p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.review .date {
  color: #999;
}
</style>
  