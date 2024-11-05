const SupplierModel = require("../models/Supplier");


class SupplierContronller {
  //lấy danh sách nhà cung cấp
    async getSupplier(req, res) {
      try {
          const supplier = await SupplierModel.find();
          res.status(200).json(supplier);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving supplier", error });
        }
      }
  //lấy thông tin chi tiết của nhà cung cấp theo id
      async getSupplierById(req, res) {
        const { id } = req.params;
        try {
          const supplier = await supplierModel.findById(id);
    
          if (!supplier) {
            return res.status(404).json({ message: "supplier not found" });
          }
    
          res.status(200).json(supplier);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving supplier", error });
        }
      }
  //Tạo nhà cung cấp mới
      async createNewSupplier(req, res) {
        const { name, phonenumber, address, email } = req.body

        if(!name || !phonenumber || !address || !email) {
          return res.status(400).json({message: "Missing required fields"})
        }
        try {
          const existingSupplier = await SupplierModel.findOne({ phonenumber, email, address });

          if (existingSupplier) {
            return res.status(400).json({ message: "Email or phone number or address already exists" });
          }

          const newSupplier = new SupplierModel({
            name,
            phonenumber,
            address,
            email
          })
          await newSupplier.save()
          res.json(newSupplier)
        } catch(error) {
            res.status(500).json({message: "Error creating supplier", error})
        }
      }
    //update nhà cung cấp
      async updateSupplier (req, res) {
        const { id } = req.params;
        const { name, phonenumber, address, email } = req.body;

        try {
          const updateSupplier = await SupplierModel.findByIdAndUpdate (
            id, 
            {name, phonenumber, address, email},
            { new: true, runValidators: true },
          );

          if (!updateSupplier){
            return res.status(400).json({ message: "supplier not found" });
          }
          res.status(200).json(updateSupplier);
        } catch {
          res.status(500).json({message: "Error updating supplier"})
        }
      } 
      //Xoa nhà cung câp
      async deleteSupplier (req, res) {
        const { id } = req.params
        try {
          const deleteSupplier = await SupplierModel.findByIdAndDelete(id)
          if(!deleteSupplier){
            return res.json(400).json({message: "supplier not found"})
          }
          res.status(200).json("Deleted")
        } catch {
          res.status(500).json({message: "Error deleting supplier"})
        }
      }
}
module.exports = new SupplierContronller();