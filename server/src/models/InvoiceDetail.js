const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceDetailSchema = new Schema({
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice', 
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  selectedSize: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    min: [1, 'Quantity must be at least 1'],
    required: true,
  },
  unitPrice: {
    type: Number,
    min: [0, 'Unit price must be positive'],
    required: true,
  },
  total: {
    type: Number,
    min: [0, 'Total must be positive'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('InvoiceDetail', InvoiceDetailSchema);
