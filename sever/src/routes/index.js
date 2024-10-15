const categoryRouter = require('./category')

function route(app){
    app.use('/category', categoryRouter)  
}

module.exports = route