const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    type: Number,
    default: 0
  },
  LoyaltyDicountId: {
    type: Schema.Types.ObjectId,
    ref: 'LoyaltyDiscount',
    default: null,
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