const { see } = require("../Controller/Admincontroller.js");
const Dao = require("../Dao/Admindao.js");

exports.Service_index = async () => {
  try {
    return await Dao.Dao_index();
  } catch (error) {
    throw error;
  }
};

exports.Service_add = async (admin) => {
  try {
    return await Dao.Dao_add(admin);
  } catch (error) {
    throw error;
  }
};

exports.Service_view = async (username) => {
  try {
    return await Dao.Dao_view(username);
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

exports.Service_update = async (username, adminData) => {
  try {
    return await Dao.Dao_update(username, adminData);
  } catch (error) {
    throw error;
  }
};

exports.Service_Delete = async (username) => {
  try {
    return await Dao.Dao_Delete(username);
  } catch (error) {
    throw error;
  }
};
