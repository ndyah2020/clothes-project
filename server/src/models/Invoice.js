const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer', 
    required: true,
  },
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  orderType: {
    type: String,
    enum: ['shop', 'online'],
    default: 'shop',
    required: true,
  },
  shippingAddress: {
    type: String,
    required: function() {
      return this.orderType === 'online';
    },
  },
  shippingFee: {
    type: Number,
    default: 0,
    min: [0, 'Shipping fee must be positive'],
  },
  promoCode: {
    type: Schema.Types.ObjectId,
    ref: 'Promotion',
    default: null,
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount must be positive'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be positive'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Cancelled', 'Completed'], 
    default: function() {
      return this.orderType === 'online' ? 'Pending' : 'Completed';
    }, 
    required: true,
  },
}, { timestamps: true });


InvoiceSchema.virtual('invoiceDetails', {
  ref: 'InvoiceDetail',
  localField: '_id',
  foreignField: 'invoice',
});

InvoiceSchema.set('toObject', { virtuals: true });
InvoiceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
