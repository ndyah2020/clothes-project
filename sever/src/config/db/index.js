const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

async function connetct (){
    try {
        await mongoose.connect('mongodb+srv://3122410008:123123123@clothes-project.tvwyy.mongodb.net/clothes-store?retryWrites=true&w=majority&appName=clothes-project');
        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect failure!!!')
    }
}
module.exports = {connetct}

