const express = require('express');
const router = express.Router();

const promotionController = require('../controller/promotionController')
//lấy danh sách khuyến mãi của khách hàng
router.get('/get-promotion', promotionController.getPromotions)
//Lấy thông tin  khuyến mãi từ name
router.get('/get-promotion-by-code', promotionController.getPromotionByCode)
//tạo khuyến mãi mơi
router.post('/create-promotion', promotionController.createPromotion)
//cập nhật khuyến mãi
router.put('/update-promotion/:id', promotionController.updatePromotion)
//Xóa khuyến mãi
router.delete('/delete-promotion/:id', promotionController.deletePromotion)

module.exports = router;