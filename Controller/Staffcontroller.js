const service = require("../Service/Staffservice.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
const Staffdetails = require("../Models/Staffmodel.js");

exports.index = async (req, res) => {
  try {
    const user = await service.Service_index();
    res.json({
      status: "Success",
      message: "sign in successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
exports.see = async (req, res) => {
  const username = req.params.username;

  try {
    // Find the staff member by username
    const staffMember = await Staffdetails.findOne({ username });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // Extract and send the balance leaves information
    const balanceLeaves = {
      Casualleave: staffMember.Casualleave,
      Medicalleave: staffMember.Medicalleave,
    };

    return res.json({
      message: "Balance leaves retrieved successfully",
      data: balanceLeaves,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.view = async (req, res) => {
  try {
    const user = await service.Service_view(req.params.username);
    if (!user) {
      return res.json({
        status: "Error",
        message: "User not found",
      });
    }
    res.json({
      status: "Success",
      message: "Retrieved SIGNIN  details successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { username } = req.params;

    const userData = {
      email: req.body.email,
      password: req.body.password,
      Casualleave: req.body.Casualleave,
      Medicalleave: req.body.Medicalleave,
      Menstrualleave: req.body.Menstrualleave,
    };

    if (userData.password) {
      adminData.password = cryptr.encrypt(userData.password);
    }

    const updatedUser = await service.Service_update(username, userData);

    if (!updatedUser) {
      return res.json({
        status: "Error",
        message: "Username incorrect or update failed",
      });
    }

    res.json({
      status: "Success",
      message: "Staff details updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.Delete = async (req, res) => {
  try {
    const deletedCount = await service.Service_Delete(req.params.username);
    if (deletedCount === 0) {
      return res.json({
        status: "Error",
        message: "please check your username",
      });
    }
    res.json({
      status: "Success",
      message: "Staff  details deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
