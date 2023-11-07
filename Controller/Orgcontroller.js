const service = require("../Service/Orgservice.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");

exports.index = async (req, res) => {
  try {
    const Organization = await service.Service_index();
    res.json({
      status: "Success",
      message: "sign in successfully",
      data: Organization,
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
    const Organization = await service.Service_view(req.params.ORGName);
    if (!Organization) {
      return res.json({
        status: "Error",
        message: "Organization details not found",
      });
    }
    res.json({
      status: "Success",
      message: "Retrieved Organization  details successfully",
      data: Organization,
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
    const { ORGName } = req.params;

    const OrganizationData = {
      ORGName: req.body.ORGName,
      Address: req.body.Address,
      Contact: req.body.Contact,
    };

    /*if (adminData.password) {
      adminData.password = cryptr.encrypt(adminData.password);
    }*/

    const updatedOrganization = await service.Service_update(
      ORGName,
      OrganizationData
    );

    if (!updatedOrganization) {
      return res.json({
        status: "Error",
        message: "Organization Details failed to Update",
      });
    }

    res.json({
      status: "Success",
      message: "Organization details updated successfully",
      data: updatedOrganization,
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
    const deletedCount = await service.Service_Delete(req.params.ORGName);
    if (deletedCount === 0) {
      return res.json({
        status: "Error",
        message: "please check your Organizationname",
      });
    }
    res.json({
      status: "Success",
      message: " Given Organization details deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
