const express = require('express')
const router = express.Router()

const ImportNoteController = require('../controller/importNoteController')
//Lấy danh sách phiểu nhập và chi teiets
router.get('/get-import-note', ImportNoteController.getImportAndImportDetail)
//Tạo phiếu nhập
router.post('/create-import-note',ImportNoteController.createImprotNodeWithImportNoteDetail)

module.exports = router;