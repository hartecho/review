import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  text: String,
});

const sectionSchema = new mongoose.Schema({
  title: String,
  content: String,
  list: [
    {
      title: String,
      content: String,
    },
  ],
  photo: {
    type: String,
    required: false, // Making the photo field optional
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
