const express = require('express')
const router = express.Router()

const customerContronller = require("../controller/customerContronller");

// Lấy tất nhà khách hàng
router.get("/get-customer", customerContronller.getCustomer);
// Láy thông tin khách hàng từ số điện thoại
router.get("/get-customer-by-phone/:phonenumber",customerContronller.getCustomerByNumber)
// Tạo mới nhà khách hàng
router.post("/create-customer", customerContronller.createNewCustomer);

// Cập nhật nhà khách hàng
router.put("/update-customer/:id", customerContronller.updateCustomer);


// Lấy thông tin nhà khách hàng theo ID
router.get("/get-customer/:id", customerContronller.getCustomerById);

//Xóa nhà khách hàng
router.delete("/delete-customer/:id", customerContronller.deleteCustomer);

module.exports = router;