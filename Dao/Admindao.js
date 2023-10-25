const admin_signin = require("../Models/Adminmodel.js");

exports.Dao_index = async () => {
  try {
    return await admin_signin.find();
  } catch (error) {
    throw error;
  }
};
exports.Dao_view = async (username) => {
  try {
    return await admin_signin.findOne({ username });
  } catch (error) {
    throw error;
  }
};
/*exports.Dao_view = async (username) => {
  try {
    return await admin_signin.findByUsername({ username });
  } catch (error) {
    throw error;
  }
};*/

exports.Dao_update = async (username, adminData) => {
  try {
    return await admin_signin.findOneAndUpdate({ username }, adminData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async (username) => {
  try {
    const result = await admin_signin.deleteOne({ username });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
};
