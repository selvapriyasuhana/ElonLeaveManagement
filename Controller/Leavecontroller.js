const Service = require("../Service/Leaveservice.js");
const { sendEmail } = require("../Service/emailservice.js");


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
    const staff = await Service.Service_look(req.params.username);
    if (!staff || staff.length === 0) {
      return res.json({
        status: "Error",
        message: "No leave requests found with the specified username",
      });
    }
    res.json({
      status: "Success",
      message: " Given username of the leave requests are retrieved",
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};
/*const mongoose = require("mongoose");
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
        user.Casualleaves,
        user.Medicalleaves,
        user.Menstrualleaves
      );
      // Determine which leave balance to update based on the leave type
      /*if (Leavetype === "Casualleaves") {
        user.Casualleaves -= Numberofdays;
      } else if (Leavetype === "Medicalleaves") {
        user.Medicalleaves -= Numberofdays;
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
    /*  if (Leavetype === "Menstrualleaves" && user.Gender !== "Female") {
        return res.json({
          status: "Error",
          message: "Menstrual leave is only applicable for women",
        });
      }

      // Deduct the appropriate leave balance based on the leave type
      if (Leavetype === "Casualleaves") {
        user.Casualleaves -= Numberofdays;
      } else if (Leavetype === "Medicalleaves") {
        user.Medicalleaves -= Numberofdays;
      } else if (Leavetype === "Menstrualleaves") {
        user.Menstrualleaves -= Numberofdays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }

      if (
        user.Casualleaves < 0 ||
        user.Medicalleaves < 0 ||
        user.Menstrualleaves < 0
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
  /*  const leave = await Leavemodel.findByIdAndUpdate(
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
};*/

// const mongoose = require("mongoose");
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
    console.log("updatedLeave",updatedLeave);

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
        user.Casualleaves,
        user.Medicalleaves,
        user.Menstrualleaves,
        
      );

      // Save the updated user record in the "users" collection
      if (Leavetype === "Menstrualleaves" && user.Gender !== "Female") {
        return res.json({
          status: "Error",
          message: "Menstrual leave is only applicable for women",
        });
      }

      // Deduct the appropriate leave balance based on the leave type
      if (Leavetype === "Casualleaves") {
        user.Casualleaves -= Numberofdays;
      } else if (Leavetype === "Medicalleaves") {
        user.Medicalleaves -= Numberofdays;
      } else if (Leavetype === "Menstrualleaves") {
        user.Menstrualleaves -= Numberofdays;
      } else {
        return res.json({
          status: "Error",
          message: "Invalid leave type",
        });
      }

      if (
        user.Casualleaves < 0 ||
        user.Medicalleaves < 0 ||
        user.Menstrualleaves < 0
      ) {
        return res.json({
          status: "Error",
          message: "Insufficient leave balance",
        });
      }

      await user.save();
     
      // If the leave request is approved, deduct the leaves from the user's record
      if (Status === "accepted") {
        

        const userEmail = user.email; // Assuming the staff member has an 'email' field
        const notificationSubject = "Leave Request Approved";
        const notificationText = "Your leave request has been approved.";

        // Send email notification for leave approval
        sendEmail(userEmail, notificationSubject, notificationText);
      }
    //   return;
    }
    if (Status === "rejected") {
      // Update the leave request status to "rejected" in the database
      /*const leaveUpdate = await Leavemodel.findByIdAndUpdate(user_id, {
        Command,
        Status: "rejected",
        
      });
       { new: true }).lean();*/
      const leave = await Leavemodel.findByIdAndUpdate(
        user_id,
        { Command, Status: "rejected" },
        { new: true }
      ).lean();

      if (!leave) {
        return res.json({
          status: "Error",
          message: "Failed to update leave request status to rejected",
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

      // Send email notification for leave rejection
      const userEmail = user.email;
      const notificationSubject = "Leave Request Rejected";
      const notificationText = "Your leave request has been rejected.";

      try {
        await sendEmail(userEmail, notificationSubject, notificationText);

        // Query the updated leave data for the response
        const leave = await Leavemodel.findById(user_id);
        res.json({
          status: "Success",
          message: "Leave request rejected successfully",
          data: leave,
        });
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
         res.json({
          status: "Error",
          message: "Error sending email for leave rejection",
        });
      }
    }

    // Update for accepted leaves or any other logic

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
  } 
  catch (error) {
    return error;
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
