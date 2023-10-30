const router = require("express").Router();
const User = require("../Models/Staffmodel");
const Admin = require("../Models/Adminmodel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
/*const {
  generateUniqueToken,
  sendPasswordResetEmail,
} = require("./passwordResetUtils"); */ // Adjust the path as needed

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
/*router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const staffMember = await User.findOne({ email });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }

    // Generate a unique reset token
    const resetToken = generateUniqueToken();

    // Save the reset token in the database
    staffMember.passwordResetToken = resetToken;
    await staffMember.save();

    // Send the password reset email with the reset token
    sendPasswordResetEmail(email, resetToken);

    return res.json({
      message: "Password reset instructions sent to your email.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});*/

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
