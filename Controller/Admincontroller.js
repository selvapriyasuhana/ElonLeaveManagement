const service = require("../Service/Adminservice.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");

exports.index = async (req, res) => {
  try {
    const admin = await service.Service_index();
    res.json({
      status: "Success",
      message: "sign in successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

/*exports.view = async (req, res) => {
  try {
    const admin = await service.Service_view(req.params.username);
    if (!admin) {
      return res.json({
        status: "Error",
        message: "User not found",
      });
    }
    res.json({
      status: "Success",
      message: "Retrieved SIGNIN  details successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};*/
exports.view = async (req, res) => {
  try {
    const admin = await service.Service_view(req.params.username);
    if (!admin) {
      return res.json({
        status: "Error",
        message: "User not found",
      });
    }
    res.json({
      status: "Success",
      message: "Retrieved SIGNIN  details successfully",
      data: admin,
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

    const adminData = {
      Name: req.body.Name,
      Age: req.body.Age,
      Gender: req.body.Gender,
      DOB: req.body.DOB,
      Contact: req.body.Contact,
      email: req.body.email,
      password: req.body.password,
    };

    if (adminData.password) {
      adminData.password = cryptr.encrypt(adminData.password);
    }

    const updatedAdmin = await service.Service_update(username, adminData);

    if (!updatedAdmin) {
      return res.json({
        status: "Error",
        message: "Username incorrect or update failed",
      });
    }

    res.json({
      status: "Success",
      message: "Admin added the Staff details successfully",
      data: updatedAdmin,
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
      message: "Admin deleted given username staff details successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
