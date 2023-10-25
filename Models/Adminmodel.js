var mongoose = require("mongoose");

var Schema = mongoose.Schema({
  Name: {
    required: false,
    type: String,
  },
  Age: {
    required: false,
    type: Number,
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
  Casualleaves: { type: Number, default: 12 },
  Medicalleaves: { type: Number, default: 7 },
  Menstrualleaves: { type: Number, default: 12 },

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
    required: false,
  },
  usertype: {
    type: [String],
    enum: ["Admin", "HR", "Staff"],
    default: ["Admin"],
    required: true,
  },
});

Schema.path("username").validate(async (username) => {
  const usernameCount = await mongoose.models.admin.countDocuments({
    username,
  });
  return !usernameCount;
}, "UserName Already Exists");

var admin_signin = (module.exports = mongoose.model("admin", Schema));
module.exports.get = function (limit) {
  return admin_signin.find().limit(limit).exec();
};
