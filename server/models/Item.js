import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  preview: String,
  description: String,
  image: String,
  moreImages: [String],
});

const Item = mongoose.model('Item', itemSchema);

export default Item;