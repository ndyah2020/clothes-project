const UserModel = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      const userAdmin = await UserModel.findById(id)

      if(userAdmin &&userAdmin.email ==='admin@gmail.com') 
        return res.status(403).json({ message: "Can not deleting admin user" });

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

  // Đăng ký người dùng
  async register(req, res) {
    const { email, password, firstName, lastName, role, accountStatus } =
      req.body;

      console.log(email, password, firstName, lastName, role, accountStatus);
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    

    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

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
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  }
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create and sign JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        "duyanh",
        { expiresIn: "1d" }
      );
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error });
    }
  }
}

module.exports = new UserController();
