const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const AdminSchema = new Schema({
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
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
});

module.exports = Admin = mongoose.model('admins', AdminSchema);
