const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Lấy tất cả sản phẩm
router.get("/get-products", productController.getProducts);

// Lấy thông tin chi tiết của một sản phẩm theo ID
router.get("/get-product/:id", productController.getProductById);
// lấy sản phẩm từ nhà cung cấp
router.get("/get-products/supplier/:supplier", productController.getProductsBySupplier)
// Tạo mới sản phẩm
router.post(
  "/create-product",
  upload.array("images"),
  productController.createProduct
);

// Cập nhật thông tin sản phẩm theo ID
router.put(
  "/update-product/:id",
  upload.array("images"),
  productController.updateProduct
);

// Xóa một sản phẩm theo ID
router.delete("/delete-product/:id", productController.deleteProduct);

// Lấy sản phẩm theo danh mục (ví dụ: category="shirt")
router.get(
  "/get-products/category/:category",
  productController.getProductsByCategory
);

// Lấy sản phẩm theo trạng thái (ví dụ: in_stock, out_of_stock)
router.get(
  "/get-products/status/:status",
  productController.getProductsByStatus
);
// Thêm size vào sản phẩm
router.patch("/addsize/:id", productController.addSize)
// Xóa size 
router.patch("/deletesize/:id", productController.deleteSize)
//cập nhật giá của size
router.patch("/update-size-price/:id", productController.changeSizePrice)
//Cập nhật số lượng sản phẩm khi mua hàng
router.patch("/update-quatity-by-sales", productController.updateQuantityProductDown)
//Cập nhật số lượng từ phiếu nhập 
router.patch('/update-quatity-by-import-note', productController.updateQuantityProductUp)
module.exports = router;
