const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    //unique: false,
  },
  Name: {
    type: String,
    required: true,
  },
  Leavetype: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Numberofdays: {
    type: Number,
    required: true,
  },
  Reason: {
    type: String,
    required: false,
  },
  Command: {
    type: String,
    required: false,
  },
  /* menstrualLeaveRequests: {
    type: [Date],
    default: [],
  },*/
  Status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});
/*leaveSchema.path("StartDate").validate(async function (StartDate) {
  const existingRequest = await mongoose.models.Leave.findOne({
    StartDate,
    username: this.username,
  });

  if (existingRequest) {
    return true;
  }

  return false;
});
// Validate uniqueness of StartDate per user
/*leaveSchema.path("username").validate(async function (username) {
  const existingRequest = await mongoose.model("Leave").findOne({
    StartDate: this.StartDate,
    username,
  });

  return !existingRequest;
}, "Leave request for this date already exists for this user");
//leaveSchema.index({ username: 1 }, { unique: false });
//leaveSchema.index({ username: 1, StartDate: 1, EndDate: 1 }, { unique: true });
*/
// Validate uniqueness of StartDate and EndDate per user
/*leaveSchema.path("username").validate(async function (username) {
  const existingRequest = await mongoose.model("Leave").findOne({
    username,
    $or: [
      {
        $and: [
          { StartDate: { $lte: this.StartDate } },
          { EndDate: { $gte: this.StartDate } },
        ],
      },
      {
        $and: [
          { StartDate: { $lte: this.EndDate } },
          { EndDate: { $gte: this.EndDate } },
        ],
      },
    ],
  });

  return !existingRequest;
}, "Leave request for this date range already exists for this user");*/

const Leave = mongoose.model("Leave", leaveSchema);

module.exports = Leave;
