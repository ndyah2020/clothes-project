const express = require('express')
const router = express.Router()

const customer = require("../controller/customerContronller");

// Lấy tất nhà cung cấp
router.get("/get-customer", customer.getCustomer);

// Tạo mới nhà cung cấp
router.post("/create-customer", customer.createNewCustomer);

// Cập nhật nhà cung cấp
router.put("/update-customer/:id", customer.updateCustomer);


// Lấy thông tin nhà cung cấp theo ID
router.get("/get-customer/:id", customer.getCustomerById);

//Xóa nhà cung cấp
router.delete("/delete-customer/:id", customer.deleteCustomer);

module.exports = router;