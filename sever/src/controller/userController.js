const UserModel = require("../model/User");
const bcrypt = require("bcrypt");

class UserController {
  // Lấy tất cả người dùng
  async getUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error });
    }
  }

  // Tạo mới người dùng
  async createNewUser(req, res) {
    const { email, password, firstName, lastName, role, accountStatus } =
      req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || "client",
        accountStatus: accountStatus || "active",
      });

      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Error creating user", error });
    }
  }

  // Cập nhật người dùng
  async updateUser(req, res) {
    const { id } = req.params;
    const { email, firstName, lastName, role, accountStatus } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { email, firstName, lastName, role, accountStatus },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error });
    }
  }

  // Xóa người dùng
  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(204).send(); // No Content
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  }

  // Lấy thông tin người dùng theo ID
  async getUserById(req, res) {
    const { id } = req.params;

    try {
      const user = await UserModel.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error });
    }
  }

  // Thay đổi trạng thái của người dùng
  async changeUserStatus(req, res) {
    const { id } = req.params;
    const { accountStatus } = req.body;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { accountStatus },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error changing user status", error });
    }
  }
}

module.exports = new UserController();
