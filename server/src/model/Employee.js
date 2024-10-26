const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: true,
    unique: true,
  },
  position: {
    type: String,
    enum: ["Manager", "Employee"],
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Working", "On Leave"],
    default: "Working",
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
