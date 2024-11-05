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
    enum: ["manager", "employee", "parking attendant"],
    required: true,
  },
  basicSalary: {
    type: Number,
    required: true,
  },
  entryDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["working", "quit"],
    default: "working",
  },
}, {
  timestamps: true,
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
