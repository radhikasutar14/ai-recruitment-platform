const express = require("express");

const router = express.Router();

const { uploadResume, updateProfile, getAllUsers } = require("../controllers/userController");
const  upload  = require("../middlewares/uploadMiddleware");
const { protect, authorizeRole } = require("../middlewares/authMiddleware");

//getAll users
router.get(
    "/",
    protect,
    authorizeRole("admin","recruiter"),
    getAllUsers
)
//upload resume
router.post(
    "/upload-resume",
    protect,
    authorizeRole("candidate"),
    upload.single("resume"),
    uploadResume
);

//user profile updated
router.put(
    "/profile",
    protect,
    updateProfile
)
module.exports = router