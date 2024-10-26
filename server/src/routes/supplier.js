const express = require('express')
const router = express.Router()

const supplier = require("../controller/supplierContronller");

// Lấy tất nhà cung cấp
router.get("/get-supplier", supplier.getSupplier);

// Tạo mới nhà cung cấp
router.post("/create-supplier", supplier.createNewSupplier);

// Cập nhật nhà cung cấp
router.put("/update-supplier/:id", supplier.updateSupplier);


// Lấy thông tin nhà cung cấp theo ID
router.get("/get-supplier/:id", supplier.getSupplierById);

//Xóa nhà cung cấp
router.delete("/delete-supplier/:id", supplier.deleteSupplier);
module.exports = router;