const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
const mongoose = require("mongoose");

const workingHoursSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staffdetails",
  },
  username:{
    type:String,
  },
  checkinTime: {
    type: Date,
    required: true,
    
  },
  checkoutTime: {
    type: Date,
    
  },
  workingHours: {
    type: String,
    default: 0,
    
  },
  date: {
    type: Date, // Include the date field
    default: Date.now,
  },
});

const WorkingHours = mongoose.model("WorkingHours", workingHoursSchema);

module.exports = WorkingHours;
