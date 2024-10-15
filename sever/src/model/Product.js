const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', Product); 