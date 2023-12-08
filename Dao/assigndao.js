const AssignedAsset = require('../Models/assign model.js');

exports.Dao_index = async function () {
  try {
    const user = await AssignedAsset.find();
    return user.length > 0 ? user : null;
  } catch (err) {
    throw err;
  }
};


exports.Dao_view = async (user_id) => {
  try {
    return await AssignedAsset.findById({ _id: user_id });
  } catch (error) {
    throw error;
  }
};
exports.Dao_update = async function (user_id, updateData) {
  try {
    const user = await AssignedAsset.findByIdAndUpdate(user_id, updateData, { new: true });
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async function (user_id) {
  try {
    const user = await AssignedAsset.findByIdAndDelete(user_id);
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};







