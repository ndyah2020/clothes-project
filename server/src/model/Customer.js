const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  point: {
    type: String,
    default: 0
  },
  rank: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: 'bronze'
  },
  discount: {
    type: String,
    default: 'no discount'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
