const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Product = new Schema({
    sku : { type: String },
    name: { type: String },
    color: { type: String },
    size: { type: String },
    quantity: { type: String},
    price: { type: String },
    status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', Product); 