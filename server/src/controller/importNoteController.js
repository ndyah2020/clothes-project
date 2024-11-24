const ImportNoteModel = require ('../models/ImportNote')
const ImportNoteDetail = require('../models/ImportNoteDetail')

class ImportNoteController {
    async createImprotNoteWithImportNoteDetail(req, res) {
        const { noteData } = req.body;
        // noteData chứa userId, supplierId, mảng obj products
        // Trong product có id (là id product), name, price, quantity, size, total
    
        try {
            const totalAmount = noteData.products.reduce((sum, product) => {
                return sum + product.total;
            }, 0);
    
            // Lấy danh sách tất cả import notes hiện có và tạo noteCode tự động
            const importNotes = await ImportNoteModel.find();
            let noteCode = "GR001"; // Giá trị mặc định
            if (importNotes.length > 0) {
                const lastNote = importNotes[importNotes.length - 1].noteCode; // Lấy code cuối cùng
                const match = lastNote.match(/^GR(\d+)$/); // Regex để lấy số từ định dạng GRxxx
                if (match) {
                    const lastNumber = parseInt(match[1], 10); // Lấy số thứ tự
                    const nextNumber = lastNumber + 1; // Tăng số thứ tự
                    noteCode = `GR${nextNumber.toString().padStart(3, "0")}`; // Định dạng lại thành GRxxx
                }
            }
    
            const importNote = new ImportNoteModel({
                supplierId: noteData.supplierId,
                noteCode,
                createdBy: noteData.userId,
                totalAmount,
            });
    
       
            const saveImportNote = await importNote.save();
    
            const importNoteDetails = noteData.products.map((product) => ({
                importNoteId: saveImportNote._id,
                productId: product.id,
                size: product.size,
                quantity: product.quantity,
                price: product.price,
                total: product.total,
            }));
    
            await ImportNoteDetail.insertMany(importNoteDetails);

            res.status(200).json({
                message: "Import note created successfully",
                importNote: saveImportNote,
                details: importNoteDetails,
            });
        } catch (error) {
            console.error("Error creating import note:", error);
            res.status(500).json({ message: "Error creating import note" });
        }
    }
    
    async getImportAndImportDetail(req, res) {
        try {
            const importData = await ImportNoteModel.find()
                .populate('supplierId', 'name phonenumber email') 
                .populate('createdBy', 'lastName firstName email') 
                .populate({
                    path: 'importNoteDetail', 
                    populate: {
                        path: 'productId', 
                        select: 'name sku', 
                    },
                });
            res.status(200).json(importData);
        } catch (error) {
            console.error('Error retrieving import:', error);
            res.status(500).json({ message: 'Error retrieving import', error });
        }
    }
    
}

module.exports = new ImportNoteController