const PromotionModel = require('../models/Promotion')

class PromotionController {
    // Hàm lấy danh sách khuyến mãi và tự động cập nhật trạng thái
    async getPromotions(req, res) {
        const now = new Date()
        try {
            const promotions = await PromotionModel.find();
            for (const promotion of promotions) {
                let newStatus;
                if (now < new Date(promotion.startTime)) {
                    newStatus = "Not Applied";
                } else if (now >= new Date(promotion.startTime) && now <= new Date(promotion.endTime)) {
                    newStatus = "Active";
                } else {
                    newStatus = "Expired";
                }
                if (promotion.status !== newStatus) {
                    await PromotionModel.updateOne({ _id: promotion._id }, { status: newStatus });
                }
            }
            res.status(200).ston(promotions);
        } catch (error) {
            console.error("Error fetching promotions:", error);
            res.status(500).json({ message: "Error fetching promotions." });
        }
    }
    
    async createPromotion(req, res) {
        const { name, startTime, endTime, discount } = req.body;
    
        const start = new Date(startTime);
        const end = new Date(endTime);
        const now = new Date(); 
    
        if (start >= end) {
            return res.status(400).json({ message: "The start time must be earlier than the end time" });
        }
    
        if (!name || !discount) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        let initialStatus;
        if (now < start) {
            initialStatus = "Not Applied";
        } else if (now >= start && now <= end) {
            initialStatus = "Active";
        } else {
            initialStatus = "Expired";
        }
    
        const upperName = name.toUpperCase();
        
        try {
            const existingName = await PromotionModel.findOne({ name: upperName });
            if (existingName) {
                return res.status(400).json({ message: "Name already exists" });
            }
    
            const newPromotion = new PromotionModel({
                name: upperName,
                startTime: start,
                endTime: end,
                discount,
                status: initialStatus, 
            });
    
            await newPromotion.save();
            res.json(newPromotion);
        } catch (error) {
            console.error("Error creating promotion:", error);
            res.status(500).json({ message: "Error creating promotion" });
        }
    }
    

    //cập nhật khuyến mãi
    async updatePromotion(req, res) {
        const {id} = req.params
        const {name, endTime, startTime, discount} = req.body

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            return res.status(400).json({ message: "The start time must be earlier than the end time" });
        }

        if(!name || !discount){
            return res.status(400).json({message: "Missing required fields"})
        }
        const upperName = name.toUpperCase();
        try {
            const existingName = await PromotionModel.findOne({ name, _id: { $ne: id } });
            if(existingName){
                return res.status(404).json({message: "Name already exists"})
            }
            const updatePromotion = await PromotionModel.findByIdAndUpdate(
                id,
                {
                    name: upperName,
                    startTime: start,
                    endTime: end,
                    discount,
                },
                { new: true, runValidators: true }
            )
            res.status(200).json(updatePromotion)
        } catch(error){
            res.status(500).json({message: "Error updating promotion"})
        }
    }
    //xóa khuyến mãi
    async deletePromotion(req, res) {
        const {id} = req.params;
        try{
            const deletePromotion = await PromotionModel.findOneAndDelete(id)
          if(!deletePromotion){
            return res.json(400).json({message: "promotion not found"})
          }
            res.status(200).json(deletePromotion)
        } catch(error){
            res.status(500).json({message: "Error deleting promotion"})
        }
    }
   
}

module.exports = new PromotionController