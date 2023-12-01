// model.js
const mongoose = require('mongoose');

const assignedAssetSchema = new mongoose.Schema({
    AssetsName: {
        type: String,
        required: true,
    },
    AssetsId: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    SubCategory: {
        type: String,
        required: true,
    },
    Model: {
        type: String,
        required: true,
    },
    PurchaseDate: {
        type: Date,
        required: true,
    },
    AssetsLocation: {
        type: String,
        required: true,
    },
});

const AssignedAsset = mongoose.model('AssignedAsset', assignedAssetSchema);

module.exports = AssignedAsset;
