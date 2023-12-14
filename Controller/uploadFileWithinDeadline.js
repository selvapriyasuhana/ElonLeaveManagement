const fs = require('fs');
const AWS = require('aws-sdk');
const mime = require('mime');
const Leavemodel = require("../Models/Leavemodel.js");
const Staffdetails = require("../Models/Staffmodel.js");
//const { sendEmail } = require('./sendEmail'); 
const { sendEmail } = require("../Service/emailservice.js");

const { uploadFileToS3 } = require('../Controller/uploadFileToS3.js'); 
 
async function uploadFileWithinDeadline(req, res) {
  try {
    const { user_id } = req.params;
    const { Leavetype, Status } = req.body;

    
    const leaveRecord = await Leavemodel.findById(user_id);

    if (!leaveRecord) {
      return res.json({
        status: "Error",
        message: "Leave request not found",
      });
    }
    console.log("Fetched Leave Record:", leaveRecord); 
    //console.log("Leave Record:", leaveRecord);
    //console.log('Medicalcertificate Object:', leaveRecord.Medicalcertificate);

    // Check if the leave request is approved and requires a file attachment
    if (Status === "accepted" && (Leavetype === "Sickleaves" || Leavetype === "Maternityleaves")) {
     
      //const deadline = new Date(leaveRecord.Medicalcertificate.deadline);
     // const deadlineFromRecord = leaveRecord.Medicalcertificate.deadline;
     const deadlineFromRecord = leaveRecord.deadline; 
      console.log("Deadline from Record:", deadlineFromRecord);
      console.log("Is Valid Date:", !isNaN(new Date(deadlineFromRecord).valueOf())); // Check if it's a valid date
      const deadline = new Date(deadlineFromRecord);
      const currentDate = new Date();
      //console.log('Deadline :', deadline );
      //console.log('Current Date:', currentDate);
    //  console.log("Deadline:", deadline.toISOString()); // Log the formatted deadline
  //console.log("Current Date:", currentDate.toISOString());
  console.log("Formatted Deadline:", deadline.toISOString()); // Log the formatted deadline
  console.log("Current Date:", currentDate.toISOString()); // Log the formatted current date

      if (currentDate <= deadline) {
        console.log("Deadline is valid. Proceeding with file attachment.");

        try {
          // Example: Attach the file to the leave record
          const s3UploadResponse = await uploadFileToS3(req.file);

          if (!s3UploadResponse || !s3UploadResponse.Location) {
            console.error("Error uploading file to S3. Response:", s3UploadResponse);
            return res.json({
              status: "Error",
              message: "File upload failed",
            });
          }

          const attachment = {
            originalName: req.file.originalname,
            fileName: req.file.filename,
           // filePath: s3UploadResponse.Location, // Use the S3 file URL
            publicUrl: s3UploadResponse.Location,
          };

          
          await Leavemodel.findByIdAndUpdate(user_id, { Medicalcertificate: attachment });

          

          return res.json({
            status: "Success",
            message: "File uploaded and leave request updated successfully",
            data: attachment,
          });
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res.json({
            status: "Error",
            message: "Error uploading file",
          });
        }
      } else {
        console.log('Deadline has passed.');
        return res.json({
          status: "Error",
          message: "The deadline for file attachment has passed.",
        });
      }
    } else {
      return res.json({
        status: "Error",
        message: "Invalid leave type or status for file attachment",
      });
    }
  } catch (error) {
    console.error("Error in uploadFileWithinDeadline:", error);
    return res.json({
      status: "Error",
      message: "Error processing file upload within deadline",
    });
  }
}

module.exports = {
  uploadFileWithinDeadline,
};
