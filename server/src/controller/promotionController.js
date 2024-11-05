const PromotionModel = require('../model/Promotion')

class PromotionController {
    async getPromotion(req, res) {
        try{
            const promotion = await PromotionModel.find();
            res.status(200).json(promotion);
        }catch(error){
            res.status(500).json({message: "Error retrieving promotion", error})
        }
    }


    //tạo khuyến mãi cho khách hàng
    async createPromotion(req, res) {
        const {name, startTime, endTime, discount} = req.body;

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            return res.status(400).json({ message: "The start time must be earlier than the end time" });
        }
        if(!name || !discount){
            return res.status(400).json({message: "Missing required fields"})
        }
        const upperName = name.toUpperCase();   
        try{
            const existingName = await PromotionModel.findOne({name})
            if(existingName){
                return res.status(404).json({message: "Name already exists"})
            }
            const newPromotion = new PromotionModel({
                name: upperName,
                startTime: start,
                endTime: end,
                discount,
            })
            await newPromotion.save();
            res.json(newPromotion)
        } catch (error) {
            res.status(500).json({message: "Error creating promotion"})
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