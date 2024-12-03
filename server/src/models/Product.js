const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category', 
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    sizes: [
      {
        size: { type: String ,required: true}, // Example: "M", "L", "XL"
        quantity: { type: Number, required: true, min: 0 }, // Stock quantity
        price: { type: Number, required: true,  min: 0 }, // Price for the specific size
        type: {
          type: String,
          enum: ["number", "letter"],
          require: true,
        }, // 'number' for number-based sizes (pants), 'letter' for letter-based sizes (shirts)
      },
    ],
    images: [
      {
        data: { type: String, required: true },
        contentType: { type: String, required: true },
      },
    ],
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
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier', 
      required: true,
    },
    discount: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", Product);