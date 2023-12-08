const Dao = require('../Dao/dao.js');

exports.Service_index = async function () {
  try {
    const users = await Dao.Dao_index();
    return users;
  } catch (error) {
    throw error;
  }
};

exports.Service_add = async function (data) {
  try {
    // Assuming you have the data to add in the request body
    const user = await Dao.Dao_add(data);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.Service_view = async function (user_id) {
  try {
    const user = await Dao.Dao_view(user_id);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.Service_see = async function () {
  try {
    const users = await Dao.Dao_see();
    return users;
  } catch (error) {
    throw error;
  }
};

exports.Service_update = async function (user_id, data) {
  try {
    const user = await Dao.Dao_update(user_id, data);
    return user;
  } catch (error) {
    throw error;
  }
};

exports.Service_Delete = async function (user_id) {
  try {
    const result = await Dao.Dao_Delete(user_id);
    return result;
  } catch (error) {
    throw error;
  }
};
