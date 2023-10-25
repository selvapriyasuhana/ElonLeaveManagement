const Dao = require("../Dao/Leavedao.js");

exports.Service_index = async () => {
  try {
    return await Dao.Dao_index();
  } catch (error) {
    throw error;
  }
};

exports.Service_view = async (user_id) => {
  try {
    return await Dao.Dao_view(user_id);
  } catch (error) {
    throw error;
  }
};

exports.Service_update = async (_id, staffData) => {
  try {
    return await Dao.Dao_update(_id, staffData);
  } catch (error) {
    throw error;
  }
};
// LeaveService.js

const StaffModel = require("../Models/Staffmodel.js"); // Import your user model

exports.Service_findByUsername = async (username) => {
  try {
    // Use your User model to find a user by username
    const user = await StaffModel.findOne({ username });

    return user;
  } catch (error) {
    throw error;
  }
};

exports.Service_Delete = async (_id) => {
  try {
    return await Dao.Dao_Delete(_id);
  } catch (error) {
    throw error;
  }
};
