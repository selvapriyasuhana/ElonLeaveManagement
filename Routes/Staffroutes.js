const router = require("express").Router();
const User = require("../Models/Staffmodel");
//const Admin = require("../Models/Adminmodel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
const nodemailer = require("nodemailer");
const { generateRandomToken } = require("../utils/utils.js");
const verifyToken = require("../middleware/middle.js");
const emailservice = require("../Service/emailservice.js");

router.get("/Staff", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome Staff signin API",
  });
});
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const decryptedPassword = cryptr.decrypt(user.password);

    if (decryptedPassword === password) {
      return res.json({
        message: "Signin successful",
        data: user,
      });
    } else {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});
router.post("/forgotpassword", async (req, res) => {
  try {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const resetToken = generateRandomToken();

      user.resetToken = resetToken;
      await user.save();

      await emailservice.sendEmail(
        email,
        "Password Reset Request",
        `Use this link to reset your password: http://localhost:5000/staff/resetpassword?token=${resetToken}`
      );

      res.status(200).send("Password reset link sent to your email");
    } catch (error) {
      console.log("Error inside the try block:", error);
      res.status(500).send("Error in processing request");
    }
  } catch (error) {
    console.log("Outer error in processing request:", error); //
    res.status(500).send("Outer error in processing request");
  }
});
router.post("/resetpassword", async (req, res) => {
  try {
    const { token, newpassword } = req.body;
    try {
      const user = await User.findOne({ resetToken: token });

      if (!user) {
        console.error("No user found with the provided token:", token);
        return res.status(404).send("Invalid or expired token");
      }
      const encryptedPassword = cryptr.encrypt(newpassword);

      user.password = encryptedPassword;
      user.resetToken = null;
      await user.save();

      /*user.password = newpassword;
      user.resetToken = null;
      await user.save();*/

      res.status(200).send("Password reset successful");
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).send("Error in processing request");
    }
  } catch (error) {
    console.error("Outer error during password reset:", error);
    res.status(500).send("Error in processing request");
  }
});


router.post("/register", async (req, res) => {
  try {
    const {
      Dateofjoining,
      Name,
      Age,
      Gender,
      DOB,
      Contact,
      password,
      username,
      email,
      usertype,
    } = req.body;
   // const admin = await Admin.findOne(); // Fetch the default leave values from the Admin model

    if (
      typeof Contact !== "string" ||
      Contact.length !== 10 ||
      isNaN(Number(Contact))
    ) {
      return res.status(400).json({
        message: "Contact should be a 10-digit number",
      });
    }

    const currentDate = new Date();
    const joiningDate = new Date(Dateofjoining);
    const joiningMonth = joiningDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month

    // Calculate userCasualleave and userMedicalleave based on the joining month
    let userCasualleaves = 12 - (joiningMonth - 1);
    let userMedicalleaves = 7 - (joiningMonth - 1);

    console.log("Joining Month: ", joiningMonth);
    console.log("User Casual Leave: ", userCasualleaves);
    console.log("User Medical Leave: ", userMedicalleaves);

    // Ensure that userCasualleave and userMedicalleave are not negative
    userCasualleaves = Math.max(userCasualleaves, 0);
    userMedicalleaves = Math.max(userMedicalleaves, 0);
    console.log("User Casual Leave (after max): ", userCasualleaves);
    console.log("User Medical Leave (after max): ", userMedicalleaves);

    // Set default values for leave balances
    let userMenstrualleaves = 0;

    // Check the gender and adjust Menstrualleaves based on the condition for females
    if (Gender === "female") {
 
      userMenstrualleaves = 12 - (joiningMonth - 1);
      userMenstrualleaves = Math.max(userMenstrualleaves, 0);
    
    }


    const encryptedPassword = cryptr.encrypt(password);

    const user = new User({
      password: encryptedPassword,
      Dateofjoining,
      Name,
      Age,
      Gender,
      DOB,
      Contact,
      username,
      email,
      usertype,
      /*Casualleave,
      Medicalleave,
      Menstrualleave,*/
      Casualleaves: userCasualleaves,
      Medicalleaves: userMedicalleaves,
      Menstrualleaves: userMenstrualleaves,
    });

    await user.save();

    return res.json({
      message: "Registered successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

const Staffcontroller = require("../Controller/Staffcontroller.js");
router.route("/get_all").get(Staffcontroller.index);

router.route("/balanceleaves/:username").get(Staffcontroller.see);

router
  .route("/detail/:username")
  .get(Staffcontroller.view)
  .patch(Staffcontroller.update)
  .put(Staffcontroller.update)
  .delete(Staffcontroller.Delete);
module.exports = router;
