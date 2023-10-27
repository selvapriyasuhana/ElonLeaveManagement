const router = require("express").Router();
const Leave = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");

router.get("/Leavepage", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Staff leave API",
  });
});

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      // menstrualLeaveRequests,
      Command,
      Status,
    } = req.body;
    const staffMember = await Staffdetails.findOne({ username });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    if (
      Leavetype !== "Casualleave" &&
      Leavetype !== "Medicalleave" &&
      Leavetype !== "Menstrualleave"
    ) {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    if (Leavetype === "Menstrualleave" && staffMember.Gender !== "female") {
      return res.json({
        status: "Error",
        message: "Menstrual leave is only applicable for women",
      });
    }

    // Get the most recent Menstrual leave request date
    /*const lastMenstrualLeaveDate = staffMember.lastMenstrualLeaveDate;

    if (Leavetype === "Menstrualleave" && lastMenstrualLeaveDate) {
      // Calculate the current month and year
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // Calculate the month and year of the last Menstrual leave request
      const lastMonth = lastMenstrualLeaveDate.getMonth() + 1;
      const lastYear = lastMenstrualLeaveDate.getFullYear();

      if (currentMonth === lastMonth && currentYear === lastYear) {
        return res.status(400).json({
          message: "One Menstrualleave per month is allowed.",
        });
      }
    }*/
    /*if (Leavetype === "Menstrualleave") {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      // Find existing Menstrual leave requests for the current month and year
      const existingRequest = staffMember.menstrualLeaveRequests.find(
        (request) => {
          const requestMonth = request.getMonth();
          const requestYear = request.getFullYear();
          return requestMonth === currentMonth && requestYear === currentYear;
        }
      );

      if (existingRequest) {
        return res.status(400).json({
          message: "One Menstrual leave request per month is allowed.",
        });
      }

      // Add the current date to the menstrualLeaveRequests array
      staffMember.menstrualLeaveRequests.push(today);
    }

    if (staffMember[Leavetype] < Numberofdays) {
      return res.status(400).json({
        message: `Insufficient ${Leavetype} balance for leave request.`,
      });
    }*/
    /* if (Leavetype !== "Menstrualleave") {
      // If it's not a Menstrual leave request, proceed as before
      // Check available leave balance
      if (staffMember[Leavetype] < Numberofdays) {
        return res.status(400).json({
          message: `Insufficient ${Leavetype} balance for leave request.`,
        });
      }
    } else {
      // For Menstrual leave request, check if it's already requested for the current month
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();

      const existingRequest = await Leave.findOne({
        username,
        Leavetype: "Menstrualleave",
        StartDate: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "One Menstrual leave request per month is allowed.",
        });
      }
    }*/
    if (Leavetype !== "Menstrualleave") {
      // If it's not a Menstrual leave request, proceed as before
      // Check available leave balance
      if (staffMember[Leavetype] < Numberofdays) {
        return res.status(400).json({
          message: `Insufficient ${Leavetype} balance for leave request.`,
        });
      }
    } else {
      // For Menstrual leave request, check if it's already requested for the current month
      const existingRequest = await Leave.findOne({
        username,
        Leavetype: "Menstrualleave",
        StartDate: {
          $gte: new Date(StartDate),
          $lt: new Date(StartDate).setMonth(new Date(StartDate).getMonth() + 1),
        },
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "One Menstrual leave request per month is allowed.",
        });
      }
    }
    if (Numberofdays > 1) {
      return res.status(400).json({
        message: "You can only request one day for Menstrual leave per month.",
      });
    }

    const staff = Leave({
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Reason,
      //menstrualLeaveRequests,
      Command,
      Status,
    });
    console.log("staff:", staff);

    await staff.save();
    //staffMember[Leavetype] -= Numberofdays;
    console.log("staffMember after save:", staffMember);
    // await staffMember.save();

    return res.json({
      message: "New staff leaverequest",
      data: staff,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate leave request detected." });
    }
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

const Leavecontroller = require("../Controller/Leavecontroller.js");
router.route("/:get_all").get(Leavecontroller.index);
router.route("/user/status/:Status").get(Leavecontroller.saw);
router.route("/user/name/:Name").get(Leavecontroller.look);
router.route("/user/id/:user_id").get(Leavecontroller.view);
router.route("/:user_id").put(Leavecontroller.update);
router.route("/:user_id").patch(Leavecontroller.update);
router.route("/:user_id").delete(Leavecontroller.Delete);

module.exports = router;
