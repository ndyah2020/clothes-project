const express = require('express');
const router = express.Router();
const InvoiceController = require('../controller/invoiceController')


router.post('/create-invoice', InvoiceController.CreateInvoiceWithDetails)
module.exports = router;