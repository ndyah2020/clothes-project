const express = require('express')
const morgan = require('morgan')
const { connect } = require('mongoose');

const app = express()
const db = require('./config/db');


app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



db.connetct()
const port = 3001
const route = require('./routes')
route(app)




app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

