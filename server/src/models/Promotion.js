const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const Promotion = new Schema ({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    startTime: {
        type: Date,
        require: true,
    },
    endTime: {
        type: Date,
        require: true,
    },
    discount: {
        type: Number,
        require: true,
    },
    status: {
        type: String,
        enum: ['Not Applied', 'Active', 'Expired'],
        default: 'Not Applied'
    }
},
{ 
    timestamps: true,
})

module.exports = mongoose.model("Promotion", Promotion)