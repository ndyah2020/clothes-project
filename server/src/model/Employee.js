const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  phonenumber: {
    type: String,
  },
  position: {
    type: String,
    enum: ["manager", "employee"],
    required: true,
  },
  basicSalary: {
    type: Number,
  },
  entryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["working", "on leave"],
    default: "working",
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
