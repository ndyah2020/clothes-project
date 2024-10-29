const express = require('express')
const router = express.Router()

const employeeController = require("../controller/employeeController");

// Lấy tất nhân viên
router.get("/get-employee", employeeController.getEmployee);

//tạo nhân viên khi tạo 1 tài khoản từ user
router.post("/create-from-user", employeeController.createEmployeeFromUser);

// cập nhật nhân viên từ user
router.put("/update-from-user/:id", employeeController.updateEmployeeFromUser);


// Tạo mới nhân viên
router.post("/create-employee", employeeController.createNewEmployee);

// Cập nhật nhân viên 
router.put("/update-employee/:id", employeeController.updateEmployee);



// Lấy thông tin nhân viên theo ID
router.get("/get-employee/:id", employeeController.getEmployeeById);

//Xóa nhân viên
router.delete("/delete-employee/:id", employeeController.deleteEmployee);

module.exports = router;