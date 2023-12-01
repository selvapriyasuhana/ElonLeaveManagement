
const AssetRequired = require('../Models/assetmodel.js');

exports.Dao_index = async function (req, res) {
  try {
    const users = await AssetRequired.find();

    if (users) {
      res.json({
        status: "Success",
        message: "Got all user details Successfully",
        data: users,
      });
    } else {
      res.json({
        status: "Error",
        message: "No users found",
      });
    }
  } catch (err) {
    res.json({
      status: "Error",
      message: err.message,
    });
  }
};

exports.Dao_view = async (req, res) => {
    try {
      const user = await AssetRequired.findById(req.params.user_id);
      if (!user) {
        return res.json({
          status: "Error",
          message: "User not found",
        });
      }
      res.json({
        status: "Success",
        message: "User details retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        status: "Error",
        message: error.message,
      });
    }
  };
  

exports.Dao_update = async (req, res) => {
    try {
    // const id = req.params.user_id;
    const user = await AssetRequired.findByIdAndUpdate(req.params.user_id,req.body, { new: true });
    if (user) {
      res.status(200).json({
        message: "User Details Updated Successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        error: "User Not Found",
      });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

exports.Dao_Delete = async (req, res) => {
  try {
  const id = req.params._id;
  const user = await AssetRequired.findByIdAndDelete(id);
  if (user) {
    res.status(200).json({
      message: "User Details deleted Successfully",
      // data: user,
    });
  } else {
    res.status(404).json({
      error: "User Not Found",
      data : id
    });
  }
} catch (error) {
  res.status(500).json({
    error: error,
  });
}
};





