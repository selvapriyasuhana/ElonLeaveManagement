const Asset = require('../Models/model.js');

exports.Dao_index = async function () {
  try {
    const user = await Asset.find();
    return user.length > 0 ? user : null;
  } catch (err) {
    throw err;
  }
};

exports.Dao_view = async function (user_id) {
  try {
    const user = await Asset.findById(user_id);
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

exports.Dao_update = async function (user_id, updateData) {
  try {
    const user = await Asset.findByIdAndUpdate(user_id, updateData, { new: true });
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async function (user_id) {
  try {
    const user = await Asset.findByIdAndDelete(user_id);
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};


