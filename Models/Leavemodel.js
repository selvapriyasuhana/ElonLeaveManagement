const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    username: {
    type: String,
    required: true,
    //unique: false,
  },
  Name: {
    type: String,
    required: true,
  },
  Leavetype: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Numberofdays: {
    type: Number,
    required: true,
  },
  Replacementworker:{
    type:String,
    required:true,
  },
  Reason: {
    type: String,
    required: false,
  },
  Command: {
    type: String,
    required: false,
  },
  
  Status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
 
  Medicalcertificate: {
    originalName: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      required:false,
    },
    filePath: {
      type: String,
      required: false,
    },
    publicUrl: {
        type:String,
        required:false,
    }
  },
  deadline: {
    type: Date,  // Assuming the deadline is a date
    required: false,
  
  },
  DocumentsDeadline: {
    type: Date,
    required: false,
  },
  base64File: {
    type: String,
    
    },
  
});
/* username: {
    type: String,
    required: true,
    //unique: false,
  },
  Name: {
    type: String,
    required: true,
  },
  Leavetype: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Numberofdays: {
    type: Number,
    required: true,
  },
   Replacementworker:{
    type:String,
    required:true,
  },
  Reason: {
    type: String,
    required: false,
  },
  Command: {
    type: String,
    required: false,
  },
 
  Status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  Medicalcertificate: {
    originalName: {
      type: String,
      required: false,
    },
    fileName: {
      type: String,
      required:false,
    },
    filePath: {
      type: String,
      required: false,
    },
    publicUrl: {
        type:String,
        required:false,
    }
  },
  deadline: {
    type: Date,  // Assuming the deadline is a date
    required: false,
  
  },
});*/

const Leave = mongoose.model("Leave", leaveSchema);

Leave.findByStatus = async function (Status) {
  try {
    return await this.find({ Status }).exec();
  } catch (error) {
    throw error;
  }
};
Leave.findByusername = async function (username) {
  try {
    return await this.find({ username }).exec();
  } catch (error) {
    throw error;
  }
};
module.exports = Leave;
