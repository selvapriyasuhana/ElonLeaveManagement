const { see } = require("../Controller/Orgcontroller.js");
const Dao = require("../Dao/Orgdao.js");

exports.Service_index = async () => {
  try {
    return await Dao.Dao_index();
  } catch (error) {
    throw error;
  }
};

exports.Service_add = async (Organization) => {
  try {
    return await Dao.Dao_add(Organization);
  } catch (error) {
    throw error;
  }
};

exports.Service_view = async (OrganizationORGName) => {
  try {
    return await Dao.Dao_view(OrganizationORGName);
  } catch (error) {
    throw error;
  }
};
/*exports.Service_view = async (username) => {
  try {
    return await Dao.Dao_view(username);
  } catch (error) {
    throw error;
  }
};*/

exports.Service_update = async (ORGName, OrganizationData) => {
  try {
    return await Dao.Dao_update(ORGName, OrganizationData);
  } catch (error) {
    throw error;
  }
};

exports.Service_Delete = async (ORGName) => {
  try {
    return await Dao.Dao_Delete(ORGName);
  } catch (error) {
    throw error;
  }
};
