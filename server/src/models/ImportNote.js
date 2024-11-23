const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImportNoteSchema = new Schema(
  {
    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier", 
      required: true,
    },
    noteCode: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    notes: {
      type: String, 
    },
  },
  {
    timestamps: true,
  }
);

ImportNoteSchema.virtual('importNoteDetail', {
  ref: 'ImportNoteDetail',
  localField: '_id', 
  foreignField: 'importNoteId', 
});

ImportNoteSchema.set('toObject', { virtuals: true });
ImportNoteSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("ImportNote", ImportNoteSchema);