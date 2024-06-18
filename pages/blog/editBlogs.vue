<template>
  <div class="wrapper">
    <h1>Add/Update Blog</h1>
    <div class="content">
      <div class="left">
        <select v-model="selectedBlog" @change="loadBlog" class="select-input">
          <option disabled value="">Please select one</option>
          <option v-for="blog in blogs" :key="blog._id" :value="blog._id">
            {{ blog.mainTitle }}
          </option>
        </select>

        <input
          type="text"
          v-model="blog.mainTitle"
          placeholder="Main Title"
          class="input"
        />
        <input
          type="text"
          v-model="blog.header"
          placeholder="Header"
          class="input"
        />
        <textarea
          v-model="blog.intro"
          placeholder="Intro"
          class="textarea"
        ></textarea>
        <input
          type="text"
          v-model="blog.image"
          placeholder="Image Path"
          class="input"
        />
        <input
          type="text"
          v-model="blog.thumbnail"
          placeholder="Thumbnail Path"
          class="input"
        />
        <textarea
          v-model="blog.preview"
          placeholder="Preview"
          class="textarea"
        ></textarea>

        <div
          v-for="(reference, index) in blog.references"
          :key="index"
          class="reference"
        >
          <input
            type="text"
            v-model="blog.references[index]"
            placeholder="Reference"
            class="input"
          />
          <button
            @click="removeReference(index)"
            class="icon-button remove-button"
          >
            ✖ Remove Reference
          </button>
        </div>
        <button @click="addReference" class="icon-button add-button">
          ➕ Add Reference
        </button>

        <input
          type="text"
          v-model="newTag"
          placeholder="Add Tag"
          @keydown.enter.prevent="addTag"
          class="input"
        />
        <div v-for="(tag, index) in blog.tags" :key="index" class="tag">
          {{ tag }}
          <button @click="removeTag(index)" class="icon-button remove-button">
            ✖ Remove Tag
          </button>
        </div>

        <div class="final-buttons">
          <button @click="addBlog" class="icon-button add-button">
            ➕ Add Blog
          </button>
          <button @click="updateBlog" class="icon-button add-button">
            💾 Update Blog
          </button>
          <button @click="deleteBlog" class="icon-button remove-button">
            ✖ Delete Blog
          </button>
        </div>

        <div class="json-input">
          <h2>Paste JSON to Add New Blog</h2>
          <textarea
            v-model="jsonInput"
            placeholder="Paste JSON here"
            class="textarea json-textarea"
          ></textarea>
          <button @click="addBlogFromJSON" class="icon-button add-button">
            ➕ Add Blog from JSON
          </button>
        </div>
      </div>

      <div class="right">
        <h2>Blog Preview</h2>
        <div class="blog-post">
          <div class="img-wrapper" v-if="blog.image">
            <NuxtImg :src="blog.image" alt="Blog Image" />
          </div>
          <p class="header">{{ blog.header }}</p>
          <p>{{ blog.intro }}</p>
          <div
            v-for="(section, index) in blog.sections"
            :key="'section-' + index"
            class="section"
          >
            <div v-if="section.photo" class="section-img-wrapper">
              <NuxtImg
                v-if="section.photo"
                :src="section.photo"
                alt="Section Photo"
              />
              <button
                @click="removeSectionPhoto(index)"
                class="icon-button remove-button"
              >
                ✖ Remove Photo
              </button>
            </div>
            <h2>
              <input
                type="text"
                v-model="section.title"
                placeholder="Section Title"
                class="input section-title"
              />
            </h2>
            <textarea
              v-model="section.content"
              placeholder="Section Content"
              class="textarea"
            ></textarea>
            <div v-if="!section.photo">
              <input
                type="text"
                v-model="section.photo"
                placeholder="Photo URL"
                class="input"
              />
              <button
                @click="addSectionPhoto(index)"
                class="icon-button add-button"
              >
                ➕ Add Photo
              </button>
            </div>

            <div
              v-for="(list, listIndex) in section.lists"
              :key="'list-' + listIndex"
              class="list-section"
            >
              <h3>
                <input
                  type="text"
                  v-model="list.header"
                  placeholder="List Header"
                  class="input list-header"
                />
              </h3>
              <ul>
                <li
                  v-for="(item, itemIndex) in list.items"
                  :key="'item-' + itemIndex"
                >
                  <strong
                    ><input
                      type="text"
                      v-model="item.title"
                      placeholder="Item Title"
                      class="input item-title"
                  /></strong>
                  <textarea
                    v-model="item.description"
                    placeholder="Item Description"
                    class="textarea item-description"
                  ></textarea>
                  <button
                    @click="removeListItem(index, listIndex, itemIndex)"
                    class="icon-button remove-button"
                  >
                    ✖ Remove List Item
                  </button>
                </li>
              </ul>
              <button
                @click="addListItem(index, listIndex)"
                class="icon-button add-button"
              >
                ➕ Add List Item
              </button>
              <button
                @click="removeList(index, listIndex)"
                class="icon-button remove-button"
              >
                ✖ Remove List
              </button>
            </div>
            <button @click="addList(index)" class="icon-button add-button">
              ➕ Add List
            </button>
            <button
              @click="removeSection(index)"
              class="icon-button remove-button"
            >
              ✖ Remove Section
            </button>
          </div>
          <button @click="addSection" class="icon-button add-button">
            ➕ Add Section
          </button>
          <h2 v-if="blog.references[0]">References</h2>
          <div v-for="(reference, index) in blog.references" :key="index">
            <p class="references">{{ reference }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let blogs = ref([]);
let selectedBlog = ref("");
let newTag = ref("");
let blog = ref({
  mainTitle: "",
  header: "",
  intro: "",
  sections: [
    {
      title: "",
      content: "",
      lists: [
        {
          header: "",
          items: [
            {
              title: "",
              description: "",
            },
          ],
        },
      ],
      photo: "",
    },
  ],
  image: "",
  thumbnail: "",
  references: [""],
  preview: "",
  tags: [],
  updated: [],
});

let jsonInput = ref("");

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
        lists: [
          {
            header: "",
            items: [
              {
                title: "",
                description: "",
              },
            ],
          },
        ],
        photo: "",
      },
    ],
    image: "",
    thumbnail: "",
    references: [""],
    preview: "",
    tags: [],
    updated: [],
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
    lists: [
      {
        header: "",
        items: [
          {
            title: "",
            description: "",
          },
        ],
      },
    ],
    photo: "",
  });
}

function removeSection(index) {
  blog.value.sections.splice(index, 1);
}

function addList(sectionIndex) {
  blog.value.sections[sectionIndex].lists.push({
    header: "",
    items: [
      {
        title: "",
        description: "",
      },
    ],
  });
}

function removeList(sectionIndex, listIndex) {
  blog.value.sections[sectionIndex].lists.splice(listIndex, 1);
}

function addListItem(sectionIndex, listIndex) {
  blog.value.sections[sectionIndex].lists[listIndex].items.push({
    title: "",
    description: "",
  });
}

function removeListItem(sectionIndex, listIndex, itemIndex) {
  blog.value.sections[sectionIndex].lists[listIndex].items.splice(itemIndex, 1);
}

function addReference() {
  blog.value.references.push("");
}

function removeReference(index) {
  blog.value.references.splice(index, 1);
}

function addTag() {
  if (newTag.value && !blog.value.tags.includes(newTag.value)) {
    blog.value.tags.push(newTag.value);
    newTag.value = "";
  }
}

function removeTag(index) {
  blog.value.tags.splice(index, 1);
}

function addSectionPhoto(index) {
  // Placeholder function to illustrate adding a section photo
  if (blog.value.sections[index].photo) {
    alert("Photo added successfully.");
  }
}

function removeSectionPhoto(index) {
  blog.value.sections[index].photo = "";
}

async function getBlogs() {
  try {
    const response = await $fetch("/api/blogs");
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
    blog.value.updated.push({
      date: new Date(),
      text: "Blog updated",
    });
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

function addBlogFromJSON() {
  try {
    const parsedBlog = JSON.parse(jsonInput.value);
    blog.value = { ...parsedBlog };
    addBlog();
    jsonInput.value = "";
  } catch (error) {
    alert("Invalid JSON: " + error.message);
    console.error("Invalid JSON:", error);
  }
}
</script>

<style scoped>
.wrapper {
  padding: 2rem 0;
  width: 90%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.content {
  display: flex;
  gap: 2rem;
}

.left {
  width: 30%;
}

.right {
  width: 70%;
}

.blog-preview {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.img-wrapper {
  width: 100%;
  height: 25rem;
  overflow: hidden;
  position: relative;
  margin-bottom: 2rem;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: "Merriweather", serif;
  color: #444;
  line-height: 1.8;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.blog-post h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #333;
}

.blog-post h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-family: "Playfair Display", serif;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.header {
  font-size: 1.4rem;
  font-style: italic;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #666;
}

.blog-post p {
  font-size: 1.2rem;
  margin-bottom: 1.2em;
}

.section-img-wrapper {
  width: 100%;
  height: auto;
  margin-bottom: 1.5em;
}

.section-img-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.list-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.list-section h3 {
  font-size: 1.5rem;
  font-family: "Playfair Display", serif;
  color: #333;
  margin-bottom: 0.5rem;
}

.list-section ul {
  padding-left: 1.5rem;
}

.list-section ul li {
  margin-bottom: 0.75rem;
}

.list-section ul li strong {
  font-size: 1.2rem;
  font-family: "Merriweather", serif;
  color: #444;
}

.references {
  font-size: 1.2rem;
  word-break: break-all;
}

.divider {
  min-height: 7rem;
  background-color: #e0f7fa;
}

.input,
.textarea,
.select-input {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.textarea {
  height: 6rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: #eef7ff;
  border: none;
  margin-bottom: 0.5rem;
}

.list-header {
  font-size: 1.3rem;
  font-weight: bold;
  background-color: #f5f5f5;
  border: none;
  margin-bottom: 0.5rem;
}

.item-title {
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #fafafa;
  border: none;
  margin-bottom: 0.5rem;
}

.item-description {
  height: 4rem;
}

button {
  background-color: transparent;
  border: none;
  color: inherit;
  padding: 0;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  margin: 4px 2px;
  border-radius: 4px;
  transition: color 0.3s ease, transform 0.3s ease;
  margin-right: 2rem;
}

button.remove-button {
  color: #f44336;
}

button.add-button {
  color: #4caf50;
}

button:hover {
  color: #000;
  transform: scale(1.1);
}

.final-buttons {
  margin-top: 2rem;
}

.tag {
  display: inline-block;
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
}

.json-input {
  margin-top: 2rem;
}

.json-input textarea {
  width: 100%;
  height: 10rem;
  margin-bottom: 10px;
}
</style>
