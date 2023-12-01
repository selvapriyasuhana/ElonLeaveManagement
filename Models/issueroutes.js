const express = require('express');
const router = express.Router();
const Asset = require('../Models/model.js');
const AssetIssue = require('../Models/issuemodel.js');
const Staffdetails = require("../Models/Staffmodel.js");

const nodemailer = require('nodemailer');

const sendAssetIssueNotification = async (issueDetails) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ramdevcse25@gmail.com',
                pass: 'tqvtdfsauntlxqju',
            },
        });
       const mailOptions = {
            from: 'ramdevcse25@gmail.com',
            to: 'mohanapriyanarayanan1@gmail.com',
            subject: 'Asset Issue Notification',
            text: `Asset issue notification:\n\n${JSON.stringify(issueDetails, null, 2)}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }};

router.post("/report-issue", async (req, res) => {
    try {
        try {
            // Check if the assigned staff member exists in the staffdetails collection
            const assetid = await Asset.findOne({ AssetId : req.body.AssetId });
    const reportedBy  =await Staffdetails.findOne({username:req.body.reportedBy});
    if (!reportedBy){
        return res.status(404).json({
            message:"Given Reportrdby field usernme is not found",
        }
        )
    }
            if (!assetid) {
                return res.status(404).json({
                    message: 'Given AssetId is not found.',
                });
                
            }      

        
        const issueDetails = {
            AssetId: req.body.AssetId,
            issueDescription: req.body.issueDescription,
            reportedBy: req.body.reportedBy,
            dateReported: req.body.dateReported,
        };
        const assetIssue = new AssetIssue(issueDetails);
        await assetIssue.save();
        await sendAssetIssueNotification(issueDetails);
                res.status(201).json({
            message: 'Asset issue reported successfully',
            data: assetIssue,
        });
    } catch (err) {
        res.status(400).json({
            message: 'Error reporting asset issue',
            error: err.message,
        });
    }
}catch (error) {
    // Handle errors from the outer try block
    res.status(500).json({
        message: 'An error occurred',
        error: error.message,
    });
}
});


module.exports = router;
