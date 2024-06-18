import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  text: String,
});

const listItemSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const listSchema = new mongoose.Schema({
  header: String,
  items: [listItemSchema],
});

const sectionSchema = new mongoose.Schema({
  title: String,
  content: String,
  lists: [listSchema],
  photo: {
    type: String,
    required: false,
  },
});

const blogSchema = new mongoose.Schema({
  mainTitle: String,
  header: String,
  intro: String,
  sections: [sectionSchema],
  references: [String],
  image: String,
  thumbnail: String,
  preview: String,
  tags: [String],
  updated: [updateSchema],
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
