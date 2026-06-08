const cloudinary = require("../config/cloudinary");
const User = require("../models/User");

//get all users
const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

        res.status(200).json({
            count : users.length,
            users
        });

    } catch(error){

        res.status(500).json({
            message : error.message
        });

    }
};

//upload resume of user
const uploadResume  = async(req, res) => {
    try{
        if(!req.file){                                                      //provided by multer middleware contains upload file
            return res.status(400).json({
                message : "No file uploaded"
            })
        }

        //convert butffer to base64
        const fileBase64 = req.file.buffer.toString("base64");              //cloudinary accepts proper format binary --> base64

        const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

        //upload to cloudinary
        const result = await cloudinary.uploader.upload(fileUri, {
            resource_type : "raw",                                          //resumes are in PDF/Document not an image
            folder : "resumes"                                              //cloudinary create folder "resume"
        });
        //save resume url in database
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        user.resume = result.secure_url;

        await user.save();

        res.status(200).json({
            message : "Resume Upload successfully",
            resumeUrl : result.secure_url,
        });

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
};
//update profile
const updateProfile = async (req, res)  => {
    try{
        const user = await User.findById(req.user._id);
        console.log(req.user);

        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }

        //update fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.experience = req.body.experience || user.experience;
        user.skills = req.body.skills || user.skills;

        await user.save();

        res.status(200).json({
            message : "User profile updated successfully"
        });

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}
module.exports = {
    getAllUsers,
    uploadResume,
    updateProfile 
}