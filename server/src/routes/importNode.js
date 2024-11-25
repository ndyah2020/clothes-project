const express = require('express')
const router = express.Router()

const ImportNoteController = require('../controller/importNoteController')
//Lấy danh sách phiểu nhập và chi teiets
router.get('/get-import-note', ImportNoteController.getImportAndImportDetail)
//Tạo phiếu nhập
router.post('/create-import-note',ImportNoteController.createImprotNoteWithImportNoteDetail)
//Nhận phiếu nhập bằng id
router.get('/get-import-note-by-id/:id', ImportNoteController.getImportNoteById)
// Thay đôi trạng thái phiếu nhập
router.patch('/update-status-import-note/:id', ImportNoteController.completeImportNote)
//Hủy phiếu nhập
router.patch('/cancel-status-import-note/:id', ImportNoteController.cancelImportNote)

module.exports = router;