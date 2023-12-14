const AWS = require('aws-sdk');
const mime = require('mime');
const fs = require('fs');
//const AWS = require('aws-sdk');
// Configure AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const s3 = new AWS.S3();

async function uploadFileToS3(file) {
  
    try {
        const fileContent = fs.readFileSync(file.path);
        const contentType = mime.getType(file.originalname) || 'application/octet-stream';
    
        const params = {
          Bucket: 'elonleave2023', // Replace with your bucket name
          Key: `medical_certificates/${file.filename}`,
          Body: fileContent,
          ContentType: contentType,
        };
    
        const uploadResult = await s3.upload(params).promise();
        return uploadResult;
      } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw error;
      }
    }
    
    module.exports = {
      uploadFileToS3,
    };


