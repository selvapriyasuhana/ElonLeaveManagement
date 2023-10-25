const Dao = require("../Dao/Staffdao.js");

exports.Service_index = async () => {
  try {
    return await Dao.Dao_index();
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

exports.Service_update = async (username, userData) => {
  try {
    return await Dao.Dao_update(username, userData);
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
