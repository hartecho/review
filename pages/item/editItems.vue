<template>
  <div class="wrapper">
    <h1>Add/Update Item</h1>

    <div class="content">
      <div class="left">
        <select v-model="selectedItem" @change="loadItem">
          <option disabled value="">Please select one</option>
          <option v-for="item in items" :key="item._id" :value="item._id">
            {{ item.name }}
          </option>
        </select>

        <input type="text" v-model="item.name" placeholder="name" />
        <input type="text" v-model="item.price" placeholder="Price" />
        <input type="text" v-model="item.preview" placeholder="Preview" />
        <textarea
          v-model="item.description"
          placeholder="Description"
        ></textarea>
        <input type="text" v-model="item.image" placeholder="Image Path" />

        <div v-for="(image, index) in item.moreImages" :key="index">
          <input
            type="text"
            v-model="item.moreImages[index]"
            placeholder="Additional Image Path"
          />
          <button @click="removeImage(index)">Remove Image</button>
        </div>
        <button @click="addImage">Add Image</button>

        <div class="final-buttons">
          <button @click="addItem">Add Item</button>
          <button @click="updateItem">Update Item</button>
          <button @click="deleteItem">Delete Item</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
const items = ref([]);
const selectedItem = ref("");
const item = ref({
  name: "",
  price: "",
  preview: "",
  description: "",
  image: "",
  moreImages: [""],
});

function init() {
  getItems();
  item.value = {
    name: "",
    price: "",
    preview: "",
    description: "",
    image: "",
    moreImages: [""],
  };
  selectedItem.value = "";
}

onMounted(async () => {
  getItems();
});

function loadItem() {
  const foundItem = items.value.find((i) => i._id === selectedItem.value);
  if (!foundItem.moreImages) {
    foundItem.moreImages = [""];
  }
  item.value = { ...foundItem };
}

function addImage() {
  item.value.moreImages.push("");
}

function removeImage(index) {
  item.value.moreImages.splice(index, 1);
}

async function getItems() {
  try {
    const response = await $fetch("/api/items");
    console.log(response);
    items.value = response || [];
  } catch (error) {
    alert("Error fetching items: " + error.message);
    console.error("Error fetching items:", error);
  }
}

async function addItem() {
  try {
    await $fetch("/api/items", {
      method: "POST",
      body: item.value,
    });
    alert("Item added successfully");
    getItems();
  } catch (error) {
    alert("Error adding items: " + error.message);
    console.error("Error adding items:", error);
  }
}

async function updateItem() {
  try {
    await $fetch(`/api/items/${item.value._id}`, {
      method: "PUT",
      body: item.value,
    });
    alert("Item updated successfully");
    getItems();
  } catch (error) {
    alert("Error updating item: " + error.message);
    console.error("Error updating item:", error);
  }
}

async function deleteItem() {
  if (!selectedItem.value) {
    alert("Please select a item to delete");
    return;
  }

  try {
    await $fetch(`/api/items/${item.value._id}`, {
      method: "DELETE",
    });
    alert("Item deleted successfully");
    init();
  } catch (error) {
    alert("Error deleting item: " + error.message);
    console.error("Error deleting item:", error);
  }
}
</script>

  
  <style scoped>
.wrapper {
  padding: 6rem 0;
  width: 90%;
  margin: 0 auto;
  min-height: 55rem;
  height: auto;
}

.content {
  display: flex;
  gap: 2rem;
}

.left {
  width: 50%;
}

input,
textarea,
select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
}

textarea {
  height: 10rem;
}

button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

.final-buttons {
  margin-top: 2rem;
}
</style>