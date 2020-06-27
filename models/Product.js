const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
  },
  img: { data: Buffer, contentType: String },
});

module.exports = Product = mongoose.model('products', ProductSchema);
