const mongoose = require('mongoose');

const assetRequiredSchema = new mongoose.Schema({
    AssetsName: {
        type: String,
        required: true,
    },
    Purpose: {
        type: String,
        required: true,
    },
    Need: {
        type: String,
        required: true,
    },
    OrderedBy: {
        type: String,
        required: true,
    },
    RequestedBy: {
        type: String,
        required: true,
    },
});

const AssetRequired = mongoose.model('AssetRequired', assetRequiredSchema);

module.exports = AssetRequired;
