const Organization = require("../Models/Orgmodel.js");

exports.Dao_index = async () => {
  try {
    return await Organization.find();
  } catch (error) {
    throw error;
  }
};
exports.Dao_view = async (ORGName) => {
  try {
    return await Organization.findOne({ ORGName });
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

exports.Dao_update = async (ORGName, OrganizationData) => {
  try {
    return await Organization.findOneAndUpdate({ ORGName }, OrganizationData, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
};

exports.Dao_Delete = async (ORGName) => {
  try {
    const result = await Organization.deleteOne({ ORGName });
    return result.deletedCount;
  } catch (error) {
    throw error;
  }
};
