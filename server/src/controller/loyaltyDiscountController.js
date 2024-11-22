const loyaltyDiscountModel = require("../models/LoyaltyDiscount")
const MonetaryNormModel = require("../models/MonetaryNorm")
class loyaltyDiscountController {
    async getLoyaltyDiscount(req, res) {
        try {
            const loyaltyDiscount = await loyaltyDiscountModel.find();
            res.status(200).json(loyaltyDiscount);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving loyalty discount", error })
        }
    }

    async getMonetaryNorm(req, res) {
        try {
            const monetaryNorm = await MonetaryNormModel.findOne();

            if (!monetaryNorm) {
                return res.status(404).json({ message: "No monetary norm found" });
            }
            res.status(200).json({
                message: "Monetary norm retrieved successfully",
                data: monetaryNorm,
            });
        } catch (error) {
            console.error("Error retrieving monetary norm:", error);

            res.status(500).json({
                message: "Failed to retrieve monetary norm data",
                error: error.message,
            });
        }
    }


    //tạo mức tiền yêu quy đổi 1 điểm đầu tiên
    async createMonetaryNorm(req, res) {
        const { moneyPerPoint } = req.body;

        try {
            const newLoyaltyDiscount = new MonetaryNormModel({
                moneyPerPoint
            })
            await newLoyaltyDiscount.save();
            res.json(newLoyaltyDiscount)
        } catch (error) {
            res.status(500).json({ message: "Error creating loyalty discount" })
        }
    }

    //tạo ưu đãi cho khách hàng
    async createLoyaltyDiscount(req, res) {
        const { name, requiredPoints, discount } = req.body;

        if (!name || !requiredPoints || !discount) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const upperName = name.toUpperCase();
        try {
            const existingName = await loyaltyDiscountModel.findOne({ name })
            if (existingName) {
                return res.status(404).json({ message: "Name already exists" })
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
            res.status(500).json({ message: "Error creating loyalty discount" })
        }
    }
    //cập nhật ưu đãi
    async updateLoyaltyDiscount(req, res) {
        const { id } = req.params
        const { name, requiredPoints, discount, status } = req.body

        if (!name) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const upperName = name.toUpperCase();
        try {
            const existingName = await loyaltyDiscountModel.findOne({ name, _id: { $ne: id } });
            if (existingName) {
                return res.status(404).json({ message: "Name already exists" })
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
        } catch (error) {
            res.status(500).json({ message: "Error updating loyalty discount" })
        }
    }
    async updateMonetaryNorm(req, res) {
        const { id } = req.params
        const { moneyPerPoint } = req.body

        if (!moneyPerPoint) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        try {
            const updateMoney = await MonetaryNormModel.findByIdAndUpdate(
                id,
                { moneyPerPoint },
                { new: true, runValidators: true }
            )
            res.status(200).json(updateMoney)
        } catch (error) {
            res.status(500).json({ message: "Error updating money discount" })
        }
    }
    
    //xóa ưu đãi
    async deleteLoyaltyDiscount(req, res) {
        const { id } = req.params;
        try {
            // const LoyaltyDiscounts = await loyaltyDiscountModel.find()
            // if(LoyaltyDiscounts.length === 1)
            const deleteLoyaltyDiscount = await loyaltyDiscountModel.findOneAndDelete(id)
            if (!deleteLoyaltyDiscount) {
                return res.json(400).json({ message: "Loyalty discount not found" })
            }
            res.status(200).json(deleteLoyaltyDiscount)
        } catch (error) {
            res.status(500).json({ message: "Error deleting Loyalty discount" })
        }
    }
}
module.exports = new loyaltyDiscountController();