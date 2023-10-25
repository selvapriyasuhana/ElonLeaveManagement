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
    } = req.body;
    const admin = await Admin.findOne(); // Fetch the default leave values from the Admin model

    const currentDate = new Date();
    const joiningDate = new Date(Dateofjoining);
    const joiningMonth = joiningDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month

    // Calculate leave balances based on the default values and joining month
    const userCasualleave = admin.Casualleaves - (joiningMonth - 1);
    const userMedicalleave = admin.Medicalleaves - (joiningMonth - 1);
    const userMenstrualleave = admin.Menstrualleaves - (joiningMonth - 1);

    //const encryptedPassword = cryptr.encrypt(password);

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
      /*Casualleave,
      Medicalleave,
      Menstrualleave,*/
      Casualleave: userCasualleave,
      Medicalleave: userMedicalleave,
      Menstrualleave: userMenstrualleave,
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
router.route("/user").get(Staffcontroller.index);

router.route("/balance/:username").get(Staffcontroller.see);

router
  .route("/user/:username")
  .get(Staffcontroller.view)
  .patch(Staffcontroller.update)
  .put(Staffcontroller.update)
  .delete(Staffcontroller.Delete);
module.exports = router;
