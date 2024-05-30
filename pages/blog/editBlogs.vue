<template>
  <div class="wrapper">
    <h1>Add/Update Blog</h1>
    <!-- prettier-ignore -->
    <div class="content">
      <div class="left">
        <select v-model="selectedBlog" @change="loadBlog">
          <option disabled value="">Please select one</option>
          <option v-for="blog in blogs" :key="blog._id" :value="blog._id">
            {{ blog.mainTitle }}
          </option>
        </select>

        <input type="text" v-model="blog.mainTitle" placeholder="Main Title" />
        <input type="text" v-model="blog.header" placeholder="Header" />
        <textarea v-model="blog.intro" placeholder="Intro"></textarea>
        <input type="text" v-model="blog.image" placeholder="Image Path" />
        <input type="text" v-model="blog.thumbnail" placeholder="Thumbnail Path" />
        <textarea v-model="blog.preview" placeholder="Preview"></textarea>

        <div v-for="(reference, index) in blog.references" :key="index">
          <input type="text" v-model="blog.references[index]" placeholder="Reference" />
          <button @click="removeReference(index)">Remove Reference</button>
        </div>
        <button @click="addReference">Add Reference</button>
        
        <div class="final-buttons">
          <button @click="addBlog">Add Blog</button>
          <button @click="updateBlog">Update Blog</button>
          <button @click="deleteBlog">Delete Blog</button>
        </div>
      </div>

      <div class="right">
        <div v-for="(section, index) in blog.sections" :key="index">
          <input type="text" v-model="section.title" placeholder="Title" />
          <textarea v-model="section.content" placeholder="Content"></textarea>
          <div v-if="section.list && section.list.length">
            <div v-for="(item, itemIndex) in section.list" :key="itemIndex">
              <input type="text" v-model="item.title" placeholder="List Item Title"/>
              <textarea v-model="item.content" placeholder="List Item Content"></textarea>
              <button @click="removeListItem(index, itemIndex)">Remove List Item</button>
            </div>
            <button @click="addListItem(index)">Add List Item</button>
          </div>
          <button @click="addList(index)">Add List</button>
          <button @click="removeSection(index)">Remove Section</button>
        </div>
        <button @click="addSection">Add More Sections</button>
      </div>
    </div>
  </div>
</template>

<script setup>
let blogs = ref([]);
let selectedBlog = ref("");
let blog = ref({
  mainTitle: "",
  header: "",
  intro: "",
  sections: [
    {
      title: "",
      content: "",
      list: [],
    },
  ],
  image: "",
  thumbnail: "",
  references: [""],
  preview: "",
});

function init() {
  getBlogs();
  selectedBlog.value = "";
  blog.value = {
    mainTitle: "",
    header: "",
    intro: "",
    sections: [
      {
        title: "",
        content: "",
        list: [],
      },
    ],
    image: "",
    thumbnail: "",
    references: [""],
    preview: "",
  };
}

// Fetch blogs on component mount
onMounted(async () => {
  getBlogs();
});

function loadBlog() {
  const foundBlog = blogs.value.find((b) => b._id === selectedBlog.value);
  if (foundBlog) {
    blog.value = { ...foundBlog };
  }
}

function addSection() {
  blog.value.sections.push({
    title: "",
    content: "",
    list: [],
  });
}

function removeSection(index) {
  blog.value.sections.splice(index, 1);
}

function addList(index) {
  if (!blog.value.sections[index].list) {
    blog.value.sections[index].list = [];
  }
  blog.value.sections[index].list.push({
    title: "",
    content: "",
  });
}

function addListItem(sectionIndex) {
  blog.value.sections[sectionIndex].list.push({
    title: "",
    content: "",
  });
}

function removeListItem(sectionIndex, itemIndex) {
  blog.value.sections[sectionIndex].list.splice(itemIndex, 1);
}

function addReference() {
  blog.value.references.push("");
}

function removeReference(index) {
  blog.value.references.splice(index, 1);
}

async function getBlogs() {
  try {
    const response = await $fetch("/api/blogs");
    console.log(response);
    blogs.value = response || [];
  } catch (error) {
    alert("Error fetching blogs: " + error.message);
    console.error("Error fetching blogs:", error);
  }
}

async function addBlog() {
  try {
    await $fetch("/api/blogs", {
      method: "POST",
      body: blog.value,
    });
    alert("Blog added successfully");
    getBlogs();
  } catch (error) {
    alert("Error adding blog: " + error.message);
    console.error("Error adding blog:", error);
  }
}

async function updateBlog() {
  try {
    await $fetch(`/api/blogs/${blog.value._id}`, {
      method: "PUT",
      body: blog.value,
    });
    alert("Blog updated successfully");
    getBlogs();
  } catch (error) {
    alert("Error updating blog: " + error.message);
    console.error("Error updating blog:", error);
  }
}

async function deleteBlog() {
  if (!selectedBlog.value) {
    alert("Please select a blog to delete");
    return;
  }

  try {
    await $fetch(`/api/blogs/${blog.value._id}`, {
      method: "DELETE",
    });
    alert("Blog deleted successfully");
    init();
  } catch (error) {
    alert("Error deleting blog: " + error.message);
    console.error("Error deleting blog:", error);
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

.right {
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