const router = require("express").Router();
const Leave = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');
require('dotenv').config();

const s3 = new AWS.S3({
    region: 'US East (N. Virginia)', // Update with your region
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: 'https://s3.amazonaws.com',
  });
router.get("/Leavepage", (req, res) => {
  res.json({
    status: "API Works",
    message: "Welcome to Staff leave API",
  });
});
const staffUploadsFolder = path.join('uploads', 'documents');
if (!fs.existsSync(staffUploadsFolder)) {
  fs.mkdirSync(staffUploadsFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, staffUploadsFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



router.post("/apply",upload.single('file'), async (req, res) => {
  try {
    const {
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Replacementworker,
      Reason,
      // menstrualLeaveRequests,
      Command,
      Status,
    } = req.body;
    const staffMember = await Staffdetails.findOne({ username });

    if (!staffMember) {
      return res.status(404).json({ message: "Staff member not found." });
    }
 if (Leavetype === "Marriageleaves" && staffMember.Maritalstatus !== "Unmarried") {
        return res.status(400).json({ message: "Marriage leaves are only applicable for unmarried staff members." });
      }
    
           const joinMonth = new Date(staffMember.Dateofjoining).getMonth()+1;
            const requestMonth = new Date(StartDate).getMonth()+1;
            console.log("Join Month:", joinMonth);
            console.log("Request Month:", requestMonth);
            
           // if (joinMonth === 0 && requestMonth <= requestMonth +2) {
            if (requestMonth < joinMonth + 3) {  
           console.log("Condition met: New staff members cannot apply for leave during the first three months.");

                return res.status(400).json({
                    message: "New staff members cannot apply for leave after joinning first three months.",
                });
            }
            if (Leavetype === "Marriageleaves") {
                const marriageDate = new Date(staffMember.MarriageDate);
                const leaveStartDate = new Date(StartDate);
          
                // Check if the leave request is within one week before the marriage date
                if (marriageDate.getTime() - leaveStartDate.getTime() > 7 * 24 * 60 * 60 * 1000) {
                  return res.status(400).json({
                    message: "Marriage leave requests should be made within one week before the marriage date.",
                  });
                }
          
                
                if (!req.file || path.extname(req.file.originalname).toLowerCase() !== '.pdf') {
                  return res.status(400).json({ message: 'An invitation PDF is required for Marriage Leaves.' });
                }
              }
          
       let s3ObjectUrl;
    if ((Leavetype === "Sickleaves" || Leavetype === "Maternityleaves")) {
        const leaveStartDate = new Date(StartDate);
        const deadlineForSubmission = new Date(leaveStartDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
        if ((Leavetype === "Sickleaves" && Numberofdays > 1) || (Leavetype === "Maternityleaves")) {
          if (!req.file) {
            return res.status(400).json({
              message: `Medical certificate is required for ${Leavetype === "Sickleaves" ? "sick" : "maternity"} leaves. You have one week to submit the certificate.`,
              deadline: deadlineForSubmission,
            });
          }
const fileContent = fs.readFileSync(req.file.path);

                // Dynamically determine Content-Type based on file extension
                const fileExtension = path.extname(req.file.originalname).toLowerCase();
                const contentType = mime.lookup(fileExtension) || 'application/octet-stream';
        
                const params = {
                  
                  Bucket: 'elonleave2023', // Replace with your bucket name
                  Key: `medical_certificates/${req.file.filename}`,
                  Body: fileContent,
                  ContentType: contentType,

                };
          
                const s3UploadResponse = await s3.upload(params).promise();
                console.log('S3 Upload Response:', s3UploadResponse);
                const s3BucketUrl = `https://elonleave2023.s3.amazonaws.com`; // Replace with your S3 bucket URL
                const filePath = `medical_certificates/${req.file.filename}`;
                 s3ObjectUrl = `${s3BucketUrl}/${filePath}`;
        }
    }
         
    let deadlineForSubmission = new Date(new Date(StartDate).getTime() + 7 * 24 * 60 * 60 * 1000);

    if (req.file) {
      console.log("Processing certificate");
      const fileContent = fs.readFileSync(req.file.path);

      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const contentType = mime.lookup(fileExtension) || 'application/octet-stream';

      const params = {
        Bucket: 'elonleave2023',
        Key: `medical_certificates/${req.file.filename}`,
        Body: fileContent,
        ContentType: contentType,
      };

      const s3UploadResponse = await s3.upload(params).promise();
      console.log('S3 Upload Response:', s3UploadResponse);
      const s3BucketUrl = `https://elonleave2023.s3.amazonaws.com`;
      const filePath = `medical_certificates/${req.file.filename}`;
      s3ObjectUrl = `${s3BucketUrl}/${filePath}`;

                // Attach the medical certificate details to the Leave document
                staffMember.Medicalcertificate = {
                  originalName: req.file.originalname,
                  fileName: req.file.filename,
                  filePath: s3ObjectUrl,
                  publicUrl: s3ObjectUrl,
                  //deadline: deadline,             
                  deadline: deadlineForSubmission,
   
    };
  } else {
    // File is not required, proceed without processing the certificate
    staffMember.Medicalcertificate = {
      originalName: null,
      fileName: null,
      filePath: null,
      publicUrl: null,
      deadline: deadlineForSubmission,
      
    };
  }
    
    if (
      Leavetype !== "Casualleaves" &&
      Leavetype !== "Medicalleaves" &&
      Leavetype !== "Menstrualleaves" &&
      Leavetype !== "Maternityleaves"&&
      Leavetype !=="Sickleaves"&&
      Leavetype !=="Marriageleaves"
    ) {
      return res.status(400).json({ message: "Invalid leave type." });
    }

    if (Leavetype === "Menstrualleaves" && staffMember.Gender !== "Female") {
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
    if (Leavetype !== "Menstrualleaves") {
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
        Leavetype: "Menstrualleaves",
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
    /*if (Numberofdays > 1) {
      return res.status(400).json({
        message: "You can only request one day for Menstrual leave per month.",
      });
    }*/
    const existingRequest = await Leave.findOne({
        username,
        Leavetype,
        StartDate,
      });
  
      if (existingRequest) {
        return res.status(400).json({ message: "Duplicate leave request detected." });
      }
      let errorMessage = null;

   const deadlineForMedicalCertificate = new Date();
      deadlineForMedicalCertificate.setDate(deadlineForMedicalCertificate.getDate() + 14);
  

    const staff = Leave({
      username,
      Name,
      Leavetype,
      StartDate,
      EndDate,
      Numberofdays,
      Replacementworker,
      Reason,
      //menstrualLeaveRequests,
      Command,
      Status,
      Medicalcertificate: {
        originalName: req.file ? req.file.originalname : null,
        fileName: req.file ? req.file.filename : null,
        filePath: req.file ? req.file.path : null,
        publicUrl: req.file ? s3ObjectUrl : null,
      
deadline: (Leavetype === "Sickleaves" || Leavetype === "Maternityleaves") || req.file
    ? deadlineForSubmission
    : null,
      
},
    })

    console.log("staff:", staff);

    await staff.save();
    //staffMember[Leavetype] -= Numberofdays;
    console.log("staffMember after save:", staffMember);
     await staffMember.save();
 if (errorMessage) {
        return res.json({
            message: errorMessage
                ? `Medical certificate is required for ${Leavetype}. You have one week to submit the certificate.`
                : "New staff leaverequest",
            leaveApplicationData: staff,
        });
    } else {
    return res.json({
      message: "New staff leaverequest",
      data: staff,
    });
 }
  /*} catch (error) {
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
});*/
    } catch (error) {
    console.error('Error during leave application:', error);
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
router.route("/get_all").get(Leavecontroller.index);
router.route("/status/:Status").get(Leavecontroller.saw);
router.route("/username/:username").get(Leavecontroller.look);
router.route("/user/id/:user_id").get(Leavecontroller.view);
router.route("/reply/:user_id").put(Leavecontroller.update);
router.route("/:user_id").patch(Leavecontroller.update);
router.route("/:user_id").delete(Leavecontroller.Delete);

module.exports = router;
