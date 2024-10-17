const express = require("express");
const router = express.Router();
const user = require("../controller/userController");

// Lấy tất cả người dùng
router.get("/get-users", user.getUsers);

// Tạo mới người dùng
router.post("/create-user", user.createNewUser);

// Cập nhật người dùng
router.put("/update-user/:id", user.updateUser);

// Xóa người dùng
router.delete("/delete-user/:id", user.deleteUser);

// Lấy thông tin người dùng theo ID
router.get("/get-user/:id", user.getUserById);

// Thay đổi trạng thái của người dùng
router.patch("/change-status/:id", user.changeUserStatus);

// Đăng ký tài khoản 
router.post("/register", user.register)

// Đăng Nhập
router.post("/login", user.login)

module.exports = router;
