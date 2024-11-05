const loyaltyDiscountModel = require("../models/LoyaltyDiscount")

class loyaltyDiscountController {
    async getLoyaltyDiscount(req, res) {
        try{
            const loyaltyDiscount = await loyaltyDiscountModel.find();
            res.status(200).json(loyaltyDiscount);
        }catch(error){
            res.status(500).json({message: "Error retrieving loyalty discount", error})
        }
    }
    //tạo ưu đãi cho khách hàng
    async createLoyaltyDiscount(req, res) {
        const {name, requiredPoints, discount} = req.body;

        if(!name || !requiredPoints || !discount){
            return res.status(400).json({message: "Missing required fields"})
        }
        const upperName = name.toUpperCase();   
        try{
            const existingName = await loyaltyDiscountModel.findOne({name})
            if(existingName){
                return res.status(404).json({message: "Name already exists"})
            }
            const newLoyaltyDiscount = new loyaltyDiscountModel({
                name: upperName,
                requiredPoints,
                discount,
                status: 'active',
            })
            await newLoyaltyDiscount.save();
            res.json(newLoyaltyDiscount)
        } catch (error) {
            res.status(500).json({message: "Error creating loyalty discount"})
        }
    }
    //cập nhật ưu đãi
    async updateLoyaltyDiscount(req, res) {
        const {id} = req.params
        const {name, requiredPoints, discount, status} = req.body

        if(!name || !requiredPoints || !discount){
            return res.status(400).json({message: "Missing required fields"})
        }
        const upperName = name.toUpperCase();
        try {
            const existingName = await loyaltyDiscountModel.findOne({ name, _id: { $ne: id } });
            if(existingName){
                return res.status(404).json({message: "Name already exists"})
            }
            const updateLoyaltyDiscount = await loyaltyDiscountModel.findByIdAndUpdate(
                id,
                {
                    name: upperName,
                    requiredPoints,
                    discount,
                    status,
                },
                { new: true, runValidators: true }
            )
            res.status(200).json(updateLoyaltyDiscount)
        } catch(error){
            res.status(500).json({message: "Error updating loyalty discount"})
        }
    }
    //xóa ưu đãi
    async deleteLoyaltyDiscount(req, res) {
        const {id} = req.params;
        try{
            const deleteLoyaltyDiscount = await loyaltyDiscountModel.findOneAndDelete(id)
          if(!deleteLoyaltyDiscount){
            return res.json(400).json({message: "Loyalty discount not found"})
          }
            res.status(200).json(deleteLoyaltyDiscount)
        } catch(error){
            res.status(500).json({message: "Error deleting Loyalty discount"})
        }
    }
}
module.exports = new loyaltyDiscountController();