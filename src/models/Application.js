const mongoose = require("mongoose");
const User = require("./User");

const applicationSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    job : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Job",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },

    phone : {
        type : String,
        required : true
    },

    skills : [{
        type : String
    }],

    experience : {
        type : String
    },

    coverLetter : {
        type : String
    },
    status : {
        type : String,
        enum : [                //enum  purpose only this values are allowed
            "pending",
            "reviewed",
            "shortlisted",
            "rejected"
        ],
        default : "pending"
    },
    
    },
    {
            timestamps : true
        }
    );

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application