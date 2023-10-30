
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  Dateofjoining: {
    type: Date,
  },
  Name: {
    required: false,
    type: String,
  },
  Age: {
    required: false,
    type: String,
  },
  Gender: {
    type: String,
  },
  DOB: {
    type: String,
  },
  Contact: {
    required: false,
    type: Number,
    length: 10,
  },

  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  Casualleaves: {
    type: Number,
    
  },
  Medicalleaves: {
    type: Number,
    
  },
  Menstrualleaves: {
    type: Number,
    required: true,
  },
  usertype: {
    type: [String],
    enum: ["Admin", "Staff"],
    default: "Staff",
    required: true,
  },
});

const Staffdetails = mongoose.model("Staffdetails", staffSchema);

module.exports = Staffdetails;
