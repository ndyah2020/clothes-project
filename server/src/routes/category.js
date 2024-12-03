const express = require('express')
const router = express.Router()

const CategoryController = require('../controller/categoryController')

router.get('/get-category', CategoryController.getCategory)
router.post('/create-category', CategoryController.createCategory)

router.put('/update-category/:id', CategoryController.updataCategory)

router.get('/get-category-by-id/:id', CategoryController.getCategoryById)
module.exports = router