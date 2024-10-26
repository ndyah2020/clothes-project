const express = require('express')
const morgan = require('morgan')


const app = express()
const db = require('./config/db');
const cors = require("cors");


app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.connetct()
app.use(cors());
const port = 3001
const route = require('./routes')
route(app)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

