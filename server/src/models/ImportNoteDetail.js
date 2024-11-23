
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImportNoteDetailSchema = new Schema(
    {
      importNoteId: {
        type: Schema.Types.ObjectId,
        ref: "ImportNote", 
        required: true,
      },
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product", 
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, 
      },
      price: {
        type: Number,
        required: true,
        min: 0, 
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      timestamps: true, // Tự động thêm createdAt và updatedAt
    }
  );
  
  module.exports = mongoose.model("ImportNoteDetail", ImportNoteDetailSchema);