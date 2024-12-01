const express = require("express");
const router = express.Router();

const dashboard = require("../controller/dashboard");

// Lấy tất nhà khách hàng
router.get("/get-datas", dashboard.getDatas);

module.exports = router;
