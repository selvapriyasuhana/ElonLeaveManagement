const Leave = require("../Models/Leavemodel.js");

exports.Dao_index = async () => {
  try {
    return await Leave.find();
  } catch (error) {
    throw error;
  }
};

exports.Dao_view = async (user_id) => {
  try {
    return await Leave.findById(user_id); // Use "user_id" directly
  } catch (error) {
    throw error;
  }
};

exports.Dao_update = async (_id, staffData) => {
  try {
    return await Leave.findByIdAndUpdate(_id, staffData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};
const StaffModel = require("../Models/Staffmodel.js");

exports.Dao_findByUsername = async (username) => {
  try {
    return await StaffModel.findOne({ username });
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async (_id) => {
  try {
    const result = await Leave.deleteOne({ _id });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
};
