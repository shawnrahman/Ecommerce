const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const OrderSchema = new Schema({
  customer: {
    type: Schema.Types.CustomerId,
    ref: 'customers',
    required: true,
  },
  date: {
    orderPlaced: Date.now,
    orderFulfiled: Date,
  },

  handle: {
    type: String,
    required: true,
    max: 40,
  },
  products: [
    {
      type: Schema.Types.ProductId,
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  status: {
    type: String,
    required: true,
  },
});

module.exports = Order = mongoose.model('orders', OrderSchema);
