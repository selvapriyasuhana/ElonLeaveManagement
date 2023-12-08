
const AssetRequired = require('../Models/assetmodel.js');

exports.Dao_index = async function () {
  try {
    const user = await AssetRequired.find();
    return user;
  } catch (error) {
    throw error;
  }
};

  exports.Dao_view = async (user_id) => {
    try {
      return await AssetRequired.findById({ _id: user_id });
    } catch (error) {
      throw error;
    }
  };
  exports.Dao_update = async function (user_id, updateData) {
    try {
      const user = await AssetRequired.findByIdAndUpdate(user_id, updateData, { new: true });
      return user ? user : null;
    } catch (error) {
      throw error;
    }
  };


exports.Dao_Delete = async function (user_id) {
  try {
    const user = await AssetRequired.findByIdAndDelete(user_id);
    return user ? user : null;
  } catch (error) {
    throw error;
  }
};
