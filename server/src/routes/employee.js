const express = require('express')
const router = express.Router()

const employee = require("../controller/employeeController");

// Lấy tất nhân viên
router.get("/get-employee", employee.getEmployee);

// Tạo mới nhân viên
router.post("/create-employee", employee.createNewEmployee);

// Cập nhật nhân viên
router.put("/update-employee/:id", employee.updateEmployee);


// Lấy thông tin nhân viên theo ID
router.get("/get-employee/:id", employee.getEmployeeById);

//Xóa nhân viên
router.delete("/delete-employee/:id", employee.deleteEmployee);

module.exports = router;