const express = require('express');
const router = express.Router();

const loyaltyDiscountController = require('../controller/loyaltyDiscountController')
//lấy danh sách ưu đãi của khách hàng
router.get('/get-loyalty-discount', loyaltyDiscountController.getLoyaltyDiscount)
//tạo ưu đãi mơi
router.post('/create-loyalty-discount', loyaltyDiscountController.createLoyaltyDiscount)
//cập nhật ưu đãi
router.put('/update-loyalty-discount/:id', loyaltyDiscountController.updateLoyaltyDiscount)
//Xóa ưu đãi
router.delete('/delete-loyalty-discount/:id', loyaltyDiscountController.deleteLoyaltyDiscount)
module.exports = router;