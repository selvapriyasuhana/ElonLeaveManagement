const Service = require('../Service/assignservice.js');

exports.index = async function (req, res) {
    try {
      const user = await Service.Service_index();
      res.json({
        status: "Success",
        message: " All Assignedasset details got by Successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  
  exports.add = async function (req, res) {
    try {
      // Assuming you have the data to add in the request body
      const user = req.body;
      const data = await Service.Service_add(user);
      res.status(201).json({
        status: "Success",
        message: "User added successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  
  exports.view = async function (req, res) {
    try {
      const user_id = req.params.user_id;
      const user = await Service.Service_view(user_id);
      res.json({
        status: "Success",
        message: "Assetassign details retrieved by _id successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  

  
  exports.update = async function (req, res) {
    try {
      const user_id = req.params.user_id;
      const data = req.body;
      const user = await Service.Service_update(user_id, data);
      res.json({
        status: "Success",
        message: "Given _id Assignedasset details updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  
  exports.Delete = async function (req, res) {
    try {
      const user_id = req.params.user_id;
      await Service.Service_Delete(user_id);
      res.json({
        status: "Success",
        message: "User details deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  
