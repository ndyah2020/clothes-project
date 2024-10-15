const express = require('express')
const router = express.Router()

const productsController = require('../controller/productController')

router.get('/show', productsController.show)
router.post('/create', productsController.create)


module.exports = router