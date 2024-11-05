const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const LoyaltyDiscount = new Schema ({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    requiredPoints: {
        type: Number,
        require: true,
    },
    discount: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        enum: ['active', 'paused'],
    }
},
{ 
    timestamps: true,
})

module.exports = mongoose.model("LoyaltyDiscount", LoyaltyDiscount)