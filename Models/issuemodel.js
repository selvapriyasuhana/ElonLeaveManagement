const mongoose = require('mongoose');

const assetIssueSchema = new mongoose.Schema({
    AssetId: {
        type: String, 
        required: true,
    },
    issueDescription: {
        type: String,
        required: true,
    },
        reportedBy: {
        type: String,
        required: true,
    },
    dateReported: {
        type: Date,
        default: Date.now,
    },
});

const AssetIssue = mongoose.model('AssetIssue', assetIssueSchema);

module.exports = AssetIssue;
