const router = require("express").Router();
const Admin = require("../Models/Adminmodel.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const generateToken = require("../utils/utils.js");
const verifyToken = require("../middleware/middle.js");

router.get("/Adminpage", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome admin signin API",
  });
});
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const decryptedPassword = cryptr.decrypt(admin.password);

    if (decryptedPassword === password) {
      return res.json({
        message: "Signin successful",
        data: admin,
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
router.post("/user", async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User Created" });
  }
  res.status(409).json({ message: "User already exists" });
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Incorrect Password" });
  }
  const token = generateToken(user);
  res.json({ token });
});

router.get("/data", verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}! This is protected data` });
});

router.post("/reset", async (req, res) => {
  const { email } = req.body;

  const user = await Admin.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const token = Math.random().toString(36).slice(-8);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 360000; // 1 hour

  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "priyaecs95@gmail.com",
      password: "",
    },
  });
  const message = {
    from: "priyaecs95@gmail.com",
    to: user.email,
    subject: "Password Reset Request",
    text: `You are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease use the following token to reset your password: ${token}\n\nIf you did not request a password reset, please ignore this email`,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) {
      res.status(500).json({ message: "Something went wrong, Try again!" });
    } else {
      res
        .status(200)
        .json({ message: "Password reset Email sent" + info.response });
    }
  });
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await Admin.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();

  res.json({ message: "Password reset Successful" });
});

router.post("/staff/register", async (req, res) => {
  try {
    const {
      password,
      username,
      usertype,
      Name,
      Age,
      Gender,
      DOB,
      Contact,
      email,
      Casualleaves,
      Medicalleaves,
      Menstrualleaves,
    } = req.body;

    const encryptedPassword = cryptr.encrypt(password);

    const admin = new Admin({
      password: encryptedPassword,
      username,
      usertype,
      Name,
      Age,
      Gender,
      DOB,
      Contact,
      email,
      Casualleaves,
      Medicalleaves,
      Menstrualleaves,
    });

    await admin.save();

    return res.json({
      message: "Registered successfully",
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});
const Admincontroller = require("../Controller/Admincontroller");
router.route("/admin").get(Admincontroller.index);

router
  .route("/admin/:username")
  .get(Admincontroller.view)
  .patch(Admincontroller.update)
  .put(Admincontroller.update)
  .delete(Admincontroller.Delete);
module.exports = router;
