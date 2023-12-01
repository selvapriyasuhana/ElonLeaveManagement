var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require('multer');
const AWS = require('aws-sdk');

var app = new express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var StaffRoutes = require("./Routes/Staffroutes.js");
var LeaveRoutes = require("./Routes/Leaveroutes.js");
var OrgRoutes = require("./Routes/Orgroutes.js");
var AttendanceRoutes=require("./Routes/Attendanceroutes.js");
const apiRoutes = require('./Routes/routes.js');
const assignRoutes = require('./Routes/assignroutes.js');
const asset = require('./Routes/assetroutes.js');
const issue = require('./Routes/issueroutes.js');
var mongodb = require("./Config.js/Mongoconfig.js");

app.use(cors());
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const mongo = mongoose.connect(mongodb.url1);
mongo.then(
  () => {
    console.log("Mongo_DB Connected Successfully");
  },
  (error) => {
    console.log(
      error,
      "Error, While connecting to Mongo_DB somthing went wrong"
    );
  }
);

var port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});

app.get("/", (req, res) => res.send("Welcome to leave management system"));

app.use("/organization", OrgRoutes);
app.use("/staff", StaffRoutes);
app.use("/staff/leave", LeaveRoutes);
app.use("/att",AttendanceRoutes);
app.use('/api', apiRoutes);
app.use('/api',assignRoutes);
app.use('/api',asset);
app.use('/api',issue);

module.exports = app;
