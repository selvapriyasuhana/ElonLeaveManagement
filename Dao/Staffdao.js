const user_signin = require("../Models/Staffmodel.js");

exports.Dao_index = async () => {
  try {
    return await user_signin.find();
  } catch (error) {
    throw error;
  }
};

exports.Dao_view = async (username) => {
  try {
    return await user_signin.findOne({ username });
  } catch (error) {
    throw error;
  }
};

exports.Dao_update = async (username, userData) => {
  try {
    return await user_signin.findOneAndUpdate({ username }, userData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async (username) => {
  try {
    const result = await user_signin.deleteOne({ username });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
};
