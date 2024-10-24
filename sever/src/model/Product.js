const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    sizes: [
      {
        size: { type: String ,required: true}, // Example: "M", "L", "XL"
        quantity: { type: Number, default: 0 }, // Stock quantity
        price: { type: Number, default: 0 }, // Price for the specific size
        type: {
          type: String,
          enum: ["number", "letter"],
          require: false,
        }, // 'number' for number-based sizes (pants), 'letter' for letter-based sizes (shirts)
      },
    ],
    images: [
      {
        data: { type: String, required: true },
        contentType: { type: String, required: true },
      },
    ],
    discount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "restocking", "discontinued"],
      default: "out_of_stock",
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    supplier: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);