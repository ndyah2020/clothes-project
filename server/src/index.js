const express = require('express');
const morgan = require('morgan');
const cors = require("cors");
const db = require('./config/db');
const route = require('./routes');
const app = express();
const port = 3000;

// Kết nối cơ sở dữ liệu
db.connect();

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Định nghĩa các route
app.use('/', route); // Kết nối các route

// Lắng nghe yêu cầu
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
