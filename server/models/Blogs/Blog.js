import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  mainTitle: String,
  header: String,
  intro: String,
  sections: [
    {
      title: String,
      content: String,
      list: [
        {
          title: String,
          content: String,
        },
      ],
    },
  ],
  references: [String],
  image: String,
  thumbnail: String,
  preview: String,
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
