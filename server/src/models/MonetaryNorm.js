const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MonetaryNorm = new Schema({
    moneyPerPoint: {
        type: Number,
        required: true,
        min: 0,
    },
}, 
{ 
    timestamps: true, 
});

module.exports = mongoose.model("MonetaryNorm", MonetaryNorm);
