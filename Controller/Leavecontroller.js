const Service = require("../Service/Leaveservice.js");

exports.index = async (req, res) => {
  try {
    const staff = await Service.Service_index();
    res.json({
      status: "Success",
      message: "ALL staff leave requests retrieved successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

exports.view = async (req, res) => {
  try {
    const staff = await Service.Service_view(req.params.user_id);
    if (!staff) {
      return res.json({
        status: "Error",
        message: "Staff  id not found",
      });
    }
    res.json({
      status: "Success",
      message: "staff leaverequest details GET by _id successfully",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
exports.saw = async (req, res) => {
  try {
    const staff = await Service.Service_saw(req.params.Status);
    if (!staff || staff.length === 0) {
      return res.json({
        status: "Error",
        message: "No leave requests found with the specified status",
      });
    }
    res.json({
      status: "Success",
      message: " Given Status of the leave requests are retrieved",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
exports.look = async (req, res) => {
  try {
    const staff = await Service.Service_look(req.params.Name);
    if (!staff || staff.length === 0) {
      return res.json({
        status: "Error",
        message: "No leave requests found with the specified Name",
      });
    }
    res.json({
      status: "Success",
      message: " Given Name of the leave requests are retrieved",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
/*exports.update = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { Command, Status } = req.body;

    // Assuming you also have access to the leave type and number of days from the leave request
    const leaveType = req.body.Leavetype;
    const numberOfDays = req.body.Numberofdays;

    // Update the leave request status and command
    const updatedLeave = await Service.Service_update(user_id, {
      Command,
      Status,
    });

    if (!updatedLeave) {
      return res.json({
        status: "Error",
        message: "Leave request not found",
      });
    }

    // If the leave request is approved, deduct the leaves from the staff record
    if (Status === "accepted") {
      const user = await Service.Service_findByUsername(updatedLeave.username);

      if (!user) {
        return res.json({
          status: "Error",
          message: "Staff record not found",
        });
      }
      console.log("User data:", user);

      // Determine which leave balance to update based on the leave type
      if (leaveType === "Casual Leave") {
        user.Casualleave -= numberOfDays;
      } else if (leaveType === "Medical Leave") {
        user.Medicalleave -= numberOfDays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }
      // Update the staff record in the "staffdetails" collection
      await db.collection("Staffdetails").updateOne(
        { _id: user._id },
        {
          $set: {
            Casualleave: user.Casualleave,
            Medicalleave: user.Medicalleave,
          },
        }
      );
    }

    res.json({
      status: "Success",
      message: "Leave request updated successfully",
      data: updatedLeaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};*/
/*const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

/*exports.update = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { Command, Status } = req.body;

    // Assuming you also have access to the leave type and number of days from the leave request
    /*const leaveType = req.body.Leavetype;
    const numberOfDays = req.body.Numberofdays;*/

// Update the leave request status and command
/*  const updatedLeave = await Service.Service_update(user_id, {
      Command,
      Status,
    });

    if (!updatedLeave) {
      return res.json({
        status: "Error",
        message: "Leave request not found",
      });
    }

    // If the leave request is approved, deduct the leaves from the staff record
    if (Status === "accepted") {
      const staff = await Service.Service_findByUsername(updatedLeave.username);

      if (!staff) {
        return res.json({
          status: "Error",
          message: "Staff record not found",
        });
      }

      // Determine which leave balance to update based on the leave type
      if (leaveType === "Casual Leave") {
        staff.Casualleave -= numberOfDays;
      } else if (leaveType === "Medical Leave") {
        staff.Medicalleave -= numberOfDays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }

      // Connect to the MongoDB instance
      await client.connect();

      // Get the "staffdetails" collection
      const database = client.db("priya");
      const collection = database.collection("staffdetails"); // Make sure the collection name is correct

      // Update the staff record in the "staffdetails" collection
      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            Casualleave: user.Casualleave,
            Medicalleave: user.Medicalleave,
          },
        }
      );

      // Close the MongoDB connection
      await client.close();
    }

    res.json({
      status: "Success",
      message: "Leave request updated successfully",
      data: updatedLeave,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};*/
const mongoose = require("mongoose");
const Staffmodel = require("../Models/Staffmodel.js");
const Leavemodel = require("../Models/Leavemodel.js");
exports.update = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { Command, Status, Leavetype, Numberofdays } = req.body;

    // Update the leave request status and command
    const updatedLeave = await Service.Service_update(user_id, {
      Leavetype,
      Command,
      Status,
    });

    if (!updatedLeave) {
      return res.json({
        status: "Error",
        message: "Leave request not found",
      });
    }

    // If the leave request is approved, deduct the leaves from the user's record
    if (Status === "accepted") {
      const username = updatedLeave.username;
      const existingStaff = await Staffmodel.findOne({ username });

      if (!existingStaff) {
        return res.json({
          status: "Error",
          message: "Staff record not found",
        });
      }

      const user = await Staffmodel.findOne({
        username: updatedLeave.username,
      });

      if (!user) {
        return res.json({
          status: "Error",
          message: "User record not found",
        });
      }
      console.log("Leavetype:", Leavetype);
      console.log("Numberofdays:", Numberofdays);
      console.log(
        "Staff member's leave balances:",
        user.Casualleave,
        user.Medicalleave,
        user.Menstrualleave
      );
      // Determine which leave balance to update based on the leave type
      /*if (Leavetype === "Casualleave") {
        user.Casualleave -= Numberofdays;
      } else if (Leavetype === "Medicalleave") {
        user.Medicalleave -= Numberofdays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }*/

      /*if (Leavetype === "Casualleave" || Leavetype === "Medicalleave") {
        const leaveBalanceField = Leavetype.toLowerCase();
        const remainingBalance = user[leaveBalanceField] - Numberofdays;

        if (remainingBalance < 0) {
          // Set the leave request to "rejected" if the balance goes negative
          updatedLeave.Status = "rejected";
          await updatedLeave.save();

          return res.json({
            status: "Error",
            message: `Insufficient ${Leavetype} balance`,
          });
        }

        user[leaveBalanceField] = remainingBalance;
        await user.save();
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }*/

      /*   if (Leavetype === "Casualleave") {
        user.Casualleave -= Numberofdays;

        if (user.Casualleave < 0) {
          return res.json({
            status: "Error",
            message: "Casual Leave balance is insufficient",
          });
        }
      } else if (Leavetype === "Medicalleave") {
        user.Medicalleave -= Numberofdays;

        if (user.Medicalleave < 0) {
          return res.json({
            status: "Error",
            message: "Medical Leave balance is insufficient",
          });
        }
      } else if (Leavetype === "Menstrualleave") {
        user.Menstrualleave -= Numberofdays;

        if (user.Menstrualleave < 0) {
          return res.json({
            status: "Error",
            message: "Menstrualleave balance is insufficient",
          });
        }
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }*/
      /*if (user.Casualleave <= 0 && user.Medicalleave <= 0) {
        updatedLeave.Status = "rejected";
        await updatedLeave.save();
      }
      // Check if both casual leave and medical leave reached 0
      if (user.Casualleave <= 0 || user.Medicalleave <= 0) {
        return res.json({
          status: "Error",
          message: "Leave balance reached 0",
        });
      }*/

      // Save the updated user record in the "users" collection
      if (Leavetype === "Menstrualleave" && user.Gender !== "female") {
        return res.json({
          status: "Error",
          message: "Menstrual leave is only applicable for women",
        });
      }

      // Deduct the appropriate leave balance based on the leave type
      if (Leavetype === "Casualleave") {
        user.Casualleave -= Numberofdays;
      } else if (Leavetype === "Medicalleave") {
        user.Medicalleave -= Numberofdays;
      } else if (Leavetype === "Menstrualleave") {
        user.Menstrualleave -= Numberofdays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }

      if (
        user.Casualleave < 0 ||
        user.Medicalleave < 0 ||
        user.Menstrualleave < 0
      ) {
        return res.json({
          status: "Error",
          message: "Insufficient leave balance",
        });
      }

      await user.save();
    }
    /*if (Leavetype === "Casualleave") {
        user.Casualleave -= Numberofdays;
        if (user.Casualleave < 0) {
          return res.json({
            status: "Error",
            message: "Insufficient casual leave",
          });
        }
      } else if (Leavetype === "Medicalleave") {
        user.Medicalleave -= Numberofdays;
        if (user.Medicalleave < 0) {
          return res.json({
            status: "Error",
            message: "Insufficient medical leave",
          });
        }
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }

      // Check if either casual leave or medical leave reached 0
      if (user.Casualleave <= 0 || user.Medicalleave <= 0) {
        return res.json({
          status: "Error",
          message: "Leave balance reached 0",
        });
      }

      // Save the updated user record in the "users" collection
      await user.save();

      // Update the leave request status only if leave balance is not 0
      updatedLeave.Status = "accepted";
      await updatedLeave.save();
    }*/

    // Update the leave record in the "leaves" collection using Mongoose
    const leave = await Leavemodel.findByIdAndUpdate(
      user_id,
      {
        Command,
        Status,
      },
      { new: true }
    );

    res.json({
      status: "Success",
      message: "Leave request updated successfully",
      data: leave,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while processing the request",
    });
  }
};

exports.Delete = async (req, res) => {
  try {
    const deletedCount = await Service.Service_Delete(req.params.user_id);
    if (deletedCount === 0) {
      return res.json({
        status: "Error",
        message: " Given staff id not found for deleting",
      });
    }
    res.json({
      status: "Success",
      message: "Given staff id leave request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
