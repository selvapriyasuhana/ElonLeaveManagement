const router = require("express").Router();
const Leave = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime-types');
require('dotenv').config();
const { uploadFileWithinDeadline } = require('../Controller/uploadFileWithinDeadline');


const s3 = new AWS.S3({
  //  region: 'US East (N. Virginia)', // Update with your region
    region:'us-east-1',
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
router.post("/uploadfileWithindeadline/:user_id", upload.single('file'), async (req, res) => {
    try {
      const { Leavetype, Status } = req.body;
  
      // Add the conditions from the /apply route
      if (Status === "accepted" && (Leavetype === "Sickleaves" || Leavetype === "Maternityleaves")) {
        // Call the uploadFileWithinDeadline function if conditions are met
        await uploadFileWithinDeadline(req, res);
      } else {
        // Handle the case when conditions are not met (if needed)
        return res.json({
          status: "Error",
          message: "Invalid conditions for file upload within deadline",
        });
      }
    } catch (error) {
      console.error("Error in POST /uploadFileWithinDeadline/:user_id:", error);
      return res.json({
        status: "Error",
        message: "Internal server error",
      });
    }
  });
 
/*function readAndConvertToBase64(filePath) {
    try {
      // Read the file content synchronously
      const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }
  
  

const s3 = new AWS.S3({
    region: 'US East (N. Virginia)', // Update with your region
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: 'https://s3.amazonaws.com',

  // region: 'us-east-1',
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

router.post("/apply",  async (req, res) => {
    console.log('Uploaded File:', req.file); // Add this line

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
      Command,
      Status,
       base64File,
    } = req.body;
    console.log('Numberofdays:', Numberofdays); // Add this line

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



               console.log("Processing certificate");
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
    if (Leavetype === "Sickleaves" || Leavetype === "Maternityleaves") {
    //if (req.file) {
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
      Leavetype !== "Sickleaves"&&
      Leavetype !== "Marriageleaves"&&
      Leavetype !== "Emergencyleaves"
    ) {
      return res.status(400).json({ message: "Invalid leave type." });
    }
    // Find the leave document before the update

    let DocumentsDeadline = null;

if (Leavetype === "Emergencyleaves" && Numberofdays > 1) {
    if (!base64File) {
      return res.status(400).json({
        message: 'Base64 document is required for emergency leave.',
      });
    }

    // Save the Base64 document to the database or perform other operations
    const base64Result = await saveBase64Document(username, Leavetype, base64File);

    if (base64Result.success) {
      return res.json({
        message: 'Base64 document applied successfully for emergency leave.',
        leave: base64Result.updatedLeave,
      });
    } else {
      return res.status(500).json({
        message: 'An error occurred during base64 document processing.',
        error: base64Result.error,
      });
    }
  }


    if (Leavetype === "Casualleaves") {
      // Check if a Casualleaves request was made in the last month
      const lastMonthCasualLeave = await Leave.findOne({
        username,
        Leavetype: "Casualleaves",
        StartDate: {
          $gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 1,
            1
          ),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      });
      if (lastMonthCasualLeave) {
        return res.status(400).json({
          message: "Only one Casualleaves request is allowed per month.",
        });
      }
    }
   

    if (Leavetype === "Casualleaves") {
      // Get the current date
      const currentDate = new Date();
      // Convert StartDate from string to Date object
      const leaveStartDate = new Date(StartDate);

      // Calculate the difference in milliseconds between the leave start date and the current date
      const differenceInTime = leaveStartDate.getTime() - currentDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);

      // Check if the difference is less than 7 days for a casual leave request
      if (differenceInDays < 7) {
        return res.status(400).json({
          message:
            "Casual leave requests should be made at least a week in advance.",
        });
      }
    }

    if (Leavetype === "Menstrualleaves" && staffMember.Gender !== "Female") {
      return res.json({
        status: "Error",
        message: "Menstrual leave is only applicable for women",
      });
    }

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
      Reason,
      Replacementworker,
      Command,
      Status,
      DocumentsDeadline,
      base64File,
      Medicalcertificate: {
       /*originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        
        publicUrl: staffMember.Medicalcertificate ? staffMember.Medicalcertificate.publicUrl : undefined,*/
       /* originalName: req.file ? req.file.originalname : null,
        fileName: req.file ? req.file.filename : null,
        filePath: req.file ? req.file.path : null,
        publicUrl: req.file ? s3ObjectUrl : null,
      
deadline: (Leavetype === "Sickleaves" || Leavetype === "Maternityleaves") || req.file
    ? deadlineForSubmission
    : null,
      
},
    })

    console.log("staff:", staff);
    console.log("staff before save:", staff);   
    await staff.save();
    console.log("staff after save:", staff);

    
    //staffMember[Leavetype] -= Numberofdays;
    console.log("staffMember after save:", staffMember);
     await staffMember.save();
     return res.status(200).json({
        message: 'Leave request successfully submitted.',
        data: staff,
      });
    } catch (error) {
        console.error('Error during leave application:', error);
        //let documentsDeadline = null; // Initialize with a default value
    
        try {
            const updatedLeave = await Leave.findOneAndUpdate(
                { username, Leavetype },
                {
                    Numberofdays:1,
                    DocumentsDeadline:null,
                },
                { new: true }
            );
    
            return res.json({
                message: 'New Staff leaverequest',
                deadline: documentsDeadline,
                leave: updatedLeave,
            });
        } catch (error) {
            console.error('Error during leave application:', error);
    
            try {
                documentsDeadline = new Date(new Date(StartDate).getTime() + 7 * 24 * 60 * 60 * 1000);
                const updatedLeave = await Leave.findOneAndUpdate(
                    { username, Leavetype },
                    {
                        DocumentsDeadline: Numberofdays > 1 && !base64File ? documentsDeadline : null,
                       // DocumentsDeadline: documentsDeadline,
                    },
                    { new: true }
                );
    
                console.log('Leave details after update:', updatedLeave);
    
                return res.json({
                    message: 'Documents are required for leave. Please submit the documents before the deadline.',
                    deadline: documentsDeadline,
                    leave: updatedLeave,
                    base64File: base64File,
                });
            } catch (error) {
                console.error('Error during leave application:', error);
            }
    
            if (error.code === 11000) {
                return res.status(400).json({ message: "Duplicate leave request detected." });
            }
    
            return res.status(500).json({
                message: "An error occurred",
                error: error.message,
            });
        }
    }
});*/
 
   

const Leavecontroller = require("../Controller/Leavecontroller.js");
router.route("/get_all").get(Leavecontroller.index);
router.route("/status/:Status").get(Leavecontroller.saw);
router.route("/username/:username").get(Leavecontroller.look);
router.route("/id/:user_id").get(Leavecontroller.view);
router.route("/reply/:user_id").put(Leavecontroller.update);
router.route("/:user_id").patch(Leavecontroller.update);
router.route("/:user_id").delete(Leavecontroller.Delete);

module.exports = router;
