const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    street: String,
    zip: String,
    city: String,
    country: String,
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  orders: {
    type: [Schema.Types.ObjectId],
    ref: 'orders',
  },
});

module.exports = Customer = mongoose.model(
  'customers',
  CustomerSchema,
);
