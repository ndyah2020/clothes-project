const SupplierModel = require("../model/User");


class SupplierContronller {

    async getSupplier(req, res) {
        try {
          const supplier = await SupplierModel.find();
          res.status(200).json(supplier);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving users", error });
        }
      }
}
module.exports = new SupplierContronller();