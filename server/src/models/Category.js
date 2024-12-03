const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    categoryCode: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["Available", "Unavailable"],
        default: "Available",
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;