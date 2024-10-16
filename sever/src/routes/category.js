const express = require('express')
const router = express.Router()

const productsController = require('../controller/productController')

router.get('/show', productsController.show)
router.get('/search', productsController.search)
router.post('/create', productsController.create)
router.put('/:id', productsController.update)

module.exports = router