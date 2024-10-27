const employeeModel = require("../model/Employee");


class EmployeeContronller {
  //lấy danh sách nhân viên
    async getEmployee(req, res) {
      try {
          const employee = await employeeModel.find();
          res.status(200).json(employee);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving employee", error });
        }
      }

  //được gọi khi tạo user
  async createEmployeeFromUser(req, res) {
    console.log("Request body:", req.body); // Thêm dòng này để kiểm tra dữ liệu nhận được
    const { email, firstName, lastName, role } = req.body;
    try {
      const employeeFromUser = new employeeModel({
        name: `${firstName} ${lastName}`,
        email,
        position: role,
      });
      await employeeFromUser.save();
      res.status(200).json(employeeFromUser);
    } catch (error) {
      res.status(500).json({ message: "Error creating employee from user", error });
    }
  }
  


  //lấy thông tin chi tiết của nhân viên theo id
      async getEmployeeById(req, res) {
        const { id } = req.params;
        try {
          const employee = await employeeModel.findById(id);
    
          if (!employee) {
            return res.status(404).json({ message: "employee not found" });
          }
    
          res.status(200).json(employee);
        } catch (error) {
          res.status(500).json({ message: "Error retrieving employee", error });
        }
      }
  //Tạo nhân viên mới
      async createNewEmployee(req, res) {
        const { name, phonenumber, address, email } = req.body

        if(!name || !phonenumber || !address || !email) {
          return res.status(400).json({message: "Missing required fields"})
        }
        try {
          const existingEmployee = await employeeModel.findOne({ phonenumber, email, address });

          if (existingEmployee) {
            return res.status(400).json({ message: "Email or phone number or address already exists" });
          }

          const newEmployee = new employeeModel({
            name,
            phonenumber,
            address,
            email
          })
          await newEmployee.save()
          res.json(newEmployee)
        } catch(error) {
            res.status(500).json({message: "Error creating employee", error})
        }
      }
    //update nhân viên
      async updateEmployee (req, res) {
        const { id } = req.params;
        const { name, phonenumber, address, email } = req.body;

        try {
          const updateEmployee = await employeeModel.findByIdAndUpdate (
            id, 
            {name, phonenumber, address, email},
            { new: true, runValidators: true },
          );

          if (!updateEmployee){
            return res.status(400).json({ message: "employee not found" });
          }
          res.status(200).json(updateEmployee);
        } catch {
          res.status(500).json({message: "Error updating employee"})
        }
      } 
      //Xoa nhân viên
      async deleteEmployee (req, res) {
        const { id } = req.params
        try {
          const deleteEmployee = await employeeModel.findByIdAndDelete(id)
          if(!deleteEmployee){
            return res.json(400).json({message: "employee not found"})
          }
          res.status(200).json("Deleted")
        } catch {
          res.status(500).json({message: "Error deleting employee"})
        }
      }
}
module.exports = new EmployeeContronller();