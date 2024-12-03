const CategoryModel = require("../models/Category");


class CategoryController {
    async getCategory(req, res){
        try{
            const categorys = await CategoryModel.find()
            res.status(200).json(categorys);
        }catch(error){
            res.status(500).json({ message: "Error retrieving categorys", error });
        }
        
    }
    
    async createCategory(req, res) {
        const { name } = req.body
        try{
            const categorys = await CategoryModel.find()
            let categoryCode = "CG001";

            if (categorys.length > 0) {
                const lastNote = categorys[categorys.length - 1].categoryCode; 
                const match = lastNote.match(/^CG(\d+)$/);
                if (match) {
                    const lastNumber = parseInt(match[1], 10);
                    const nextNumber = lastNumber + 1; 
                    categoryCode = `CG${nextNumber.toString().padStart(3, "0")}`; 
                }
            }

            const category = new CategoryModel({
                categoryCode,
                name,
            })
            await category.save(category)
            res.status(200).json()
        }catch(error){
            res.status(500).json({ message: "Error creating customer", error })
        }
    }
    async updataCategory(req, res) {
        const { id } = req.params;
        const { name, status } = req.body;
        try {
            const updateCategory = await CategoryModel.findByIdAndUpdate(
                id,
                {
                    name,
                    status,
                },
                { new: true, runValidators: true },
            )
            
            if (!updateCategory) {
                return res.status(404).json({ message: "Category not found" });
            }
            res.status(200).json(updateCategory);
        } catch (error){
            res.status(500).json({ message: "Error updating category" })
        }
    }
    async getCategoryById(req, res) {
        const { id } = req.params;
        try {
            const category = await CategoryModel.findById(id)
            if(!category){
                res.status(404).json({message: 'Categoty not fond'})
            }
            res.status(200).json(category)
        } catch (error) {
            res.status(500).json({ message: "Error retrieving categoty", error });
        }
    }
}

module.exports = new CategoryController;