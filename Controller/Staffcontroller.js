const service = require("../Service/Staffservice.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
const Staffdetails = require("../Models/Staffmodel.js");

exports.index = async (req, res) => {
  try {
    const user = await service.Service_index();
    res.json({
      status: "Success",
      message: " All staff Details Viewed By GET Method",
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
      Casualleaves: staffMember.Casualleaves,
      Medicalleaves: staffMember.Medicalleaves,
      Menstrualleaves: staffMember.Menstrualleaves,
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
      message: "Given Username Staff details retrieved successfully",
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
      Empid:req.body.Empid ,
      Dateofjoining: req.body.Dateofjoining,
      Name: req.body.Name,
      Age: req.body.Age,
      Gender: req.body.Gender,
      DOB: req.body.DOB,
      Contact: req.body.Contact,
      Maritalstatus:req.body.Maritalstatus,
      Address:req.body.Address,
      Pincode:req.body.Pincode,
      City:req.body.City,
      State:req.body.State,
      BankName:req.body.BankName,
      Ifsc:req.body.Ifsc,
      AccountNo:req.body.AccountNo,
      Salary:req.body.Salary,
      Branch:req.body.Salary,
      Otp:req.body.Otp,
      BloodGroup:req.body.BloodGroup,
      Role:req.body.Role, 
      email: req.body.email,
      password: req.body.password,
      Casualleaves: req.body.Casualleaves,
      Medicalleaves: req.body.Medicalleaves,
      Menstrualleaves: req.body.Menstrualleaves,
    };

    if (userData.password) {
      userData.password = cryptr.encrypt(userData.password);
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
