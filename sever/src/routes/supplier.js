const express = require('express')
const router = express.Router()

const supplier = require("../controller/supplierContronller");

// Lấy tất nhà cung cấp
router.get("/show", supplier.getSupplier);

// Tạo mới nhà cung cấp
router.post("/create-supplier", supplier.createNewUser);

// Cập nhật nhà cung cấp
router.put("/update-supplier/:id", supplier.updateUser);


// Lấy thông tin nhà cung cấp theo ID
router.get("/get-supplier/:id", supplier.getUserById);



module.exports = router;