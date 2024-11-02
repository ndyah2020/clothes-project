const express = require('express');
const router = express.Router();

const userRouter = require("./user");
const productRouter = require("./product");
const supplierRouter = require("./supplier"); 
const employeeRouter = require("./employee");
const customerRouter = require("./customer")

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/supplier', supplierRouter)
router.use('/employee', employeeRouter)
router.use('/customer', customerRouter)

module.exports = router;
