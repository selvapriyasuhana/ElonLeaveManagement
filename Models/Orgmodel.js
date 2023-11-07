// organizationSchema.js

const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  ORGName: {
    type: String,
    required: true,
  },
  Address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
  },
  Contact: {
    phone: String,
    email: String,
  },
});

const Organization = mongoose.model("Organization", organizationSchema);

module.exports = Organization;
