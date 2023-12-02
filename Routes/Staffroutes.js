const router = require("express").Router();
const User = require("../Models/Staffmodel");
const Organization = require("../Models/Orgmodel.js");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("priya");
const nodemailer = require("nodemailer");
const { generateRandomToken } = require("../utils/utils.js");
const verifyToken = require("../middleware/middle.js");
//const emailservice = require("../Service/emailservice.js");
const { sendEmail } = require("../Service/emailservice.js");
const randomstring = require("randomstring");
const otpGenerator = require("otp-generator");



router.get("/Staff", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome Staff signin API",
  });
});
router.post("/signin", async (req, res) => {
  try {
    const { username, ORGName, password } = req.body;
  const organization = await Organization.findOne({ ORGName });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found. Staff sign-in denied.",
      });
    }


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
/*router.post("/forgotpassword", async (req, res) => {
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

      

      res.status(200).send("Password reset successful");
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).send("Error in processing request");
    }
  } catch (error) {
    console.error("Outer error during password reset:", error);
    res.status(500).send("Error in processing request");
  }
});*/
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "priyaecs95@gmail.com",
      pass: "ykbhggznozmodutz",
    },
  });
function generateOTP() {
    const chars = "0123456789";
    const len = chars.length;
    let Otp = "";
    for (let i = 0; i < 6; i++) {
      Otp += chars[Math.floor(Math.random() * len)];
  }
    return Otp;
  }
  
  async function sendOTP(email, Otp) {
    const mailOptions = {
      from: "priyaecs95@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${Otp}`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("OTP sent successfully");
    } catch (err) {
      console.error(err);
      throw new Error("Failed to send OTP");
    }
  }
router.post("/forgotpassword", async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      } else {
        const Otp = generateOTP();
        const user = await User.findOneAndUpdate(
          { email },
          { $set: { Otp } },
          { new: true }
        );
        user.Otp = Otp;
        await user.save();
        await sendOTP(email, Otp);
        res.status(200).json({ message: "OTP sent successfully" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  
  router.post("/verify", async (req, res) => {
    const { email, Otp } = req.body;
  
    if ( !email || !Otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (user && user.Otp === Otp) {
        user.Otp = null;
        await user.save();
        res.json({ success: true, message: "OTP is valid" });
      } else {
        res.status(401).json({ error: "Invalid OTP" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  });
  
  router.post("/resetpassword", async (req, res) => {
    const { username, newpassword } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      if (!newpassword) {
        return res.status(400).json({
          message: "New password is empty",
        });
      }
      const encryptedNewPassword = cryptr.encrypt(newpassword);
      user.password = encryptedNewPassword;
      await user.save();
  
      return res.status(200).json({
        message: "Password reset successful",
        data: user,
      });
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
      Empid,
      Dateofjoining,
      Name,
      Age,
      Gender,
      DOB,
      Maritalstatus,
      Address,
      Pincode,
      City,
      State,
      BankName,
      Ifsc,
      AccountNo,
      Salary,
      Branch,
      Otp,
      BloodGroup,
      created_at,
      Contact,
      password,
      username,
      email,
      usertype,
      ORGName,
      Role,
    } = req.body;
   
const organization = await Organization.findOne({ ORGName });

    if (!organization) {
      return res.status(404).json({
        message: "Organization not found. Staff registration denied.",
      });
    }

    if (
      typeof Contact !== "string" ||
      Contact.length !== 10 ||
      isNaN(Number(Contact))
    ) {
      return res.status(400).json({
        message: "Contact should be a 10-digit number",
      });
    }
    let userEmergencyleaves = 7;
    let userMaternityleaves = 15;
    let userSickleaves = 15;
    let userMarriageleaves = 15;
    if (Maritalstatus === "Married") {
        if (Gender === "Female") {
          userMaternityleaves = 15; // Married women get 15 days
        } else if (Gender === "Male") {
          userMaternityleaves = 3; // Married men get 3 days
        }
      } else if (Maritalstatus === "Unmarried" && Gender === "Male") {
        userMaternityleaves = 0; // Unmarried men get 0 days
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
    userMaternityleaves = Math.max(userMaternityleaves, 0);
    userEmergencyleaves = Math.max(userEmergencyleaves, 0);
    console.log("User Casual Leave (after max): ", userCasualleaves);
    console.log("User Medical Leave (after max): ", userMedicalleaves);

    // Set default values for leave balances
    let userMenstrualleaves = 0;

    // Check the gender and adjust Menstrualleaves based on the condition for females
    if (Gender === "Female") {
 
      userMenstrualleaves = 12 - (joiningMonth - 1);
      userMenstrualleaves = Math.max(userMenstrualleaves, 0);
    
    }


    const encryptedPassword = cryptr.encrypt(password);

    const user = new User({
      password: encryptedPassword,
      Empid,
      Dateofjoining,
      Name,
      Age,
      Gender,
      DOB,
      Maritalstatus,
       Address,
      Pincode,
      City,
      State,
      BankName,
      Ifsc,
      AccountNo,
      Salary,
      Branch,
      Otp,
      BloodGroup,
      created_at,
      Contact,
      username,
      email,
      usertype,
      Casualleaves: userCasualleaves,
      Medicalleaves: userMedicalleaves,
      Menstrualleaves: userMenstrualleaves,
      Maternityleaves:userMaternityleaves,
      Sickleaves:userSickleaves,
      MarriageLeaves:userMarriageleaves,
      Emergencyleaves:userEmergencyleaves,
      ORGName,
      Role,
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
router.route("/balanceleaves/getall").get (Staffcontroller.getAllBalanceLeaves);
router.route("/balanceleaves/:username").get(Staffcontroller.see);

router
  .route("/detail/:username")
  .get(Staffcontroller.view)
  .patch(Staffcontroller.update)
  .put(Staffcontroller.update)
  .delete(Staffcontroller.Delete);
module.exports = router;
