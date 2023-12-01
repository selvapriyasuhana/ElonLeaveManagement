const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
  username: String,
  Role: String,
  date: Date,
  checkin: Date,
  checkout: Date,
  checkinStatus: {
    required: false,
    type: Boolean,
  },
 
  startTime: Date, // New field for start time
  endTime: Date,   // New field for end time
  created_at: {
    type: Date,
    default: Date.now,
  },

});

const Entry = mongoose.model('Entry',EntrySchema);
module.exports = Entry;
//var Signup = (module.exports = mongoose.model('employee', Schema));
