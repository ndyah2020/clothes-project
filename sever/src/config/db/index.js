const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

async function connetct (){
    try {
        await mongoose.connect('mongodb://localhost:27017/clothes-store');
        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect failure!!!')
    }
}
module.exports = {connetct}

