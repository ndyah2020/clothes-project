const express = require('express');
const router = express.Router();
const InvoiceController = require('../controller/invoiceController')

//Lấy thông tin hóa đơn 
router.get('/get-invoice',InvoiceController.getInvoices)
router.get('/get-invoice-by-id/:id', InvoiceController.getInvoiceById)
//tạo hóa đơn
router.post('/create-invoice', InvoiceController.CreateInvoiceWithDetails)
//Xác nhận hóa đơn
router.patch('/completed-invoice', InvoiceController.completeInvoice)
//hủy hóa đơn
router.patch('/cancel-invoice/:id',InvoiceController.cancelInvoice)

module.exports = router;