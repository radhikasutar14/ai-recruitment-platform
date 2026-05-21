const express = require("express");
const router = express.Router();
const {applyJob, 
    getJobApplications, 
    updateApplicationStatus,
    getMyApplicaton
} = require("../controllers/applicationController");

const {
    protect,
    authorizeRole
} = require("../middlewares/authMiddleware");



//apply job
router.post(
    "/apply/:jobId",
    protect,
    authorizeRole("candidate"),
    applyJob
)

//recruiter view application
router.get(
    "/job/:jobId",
    protect,
    authorizeRole("recruiter"),
    getJobApplications
)

//for recruiter - put method to update application
router.put(
    "/:applicationId/status",
    protect,
    authorizeRole("recruiter"),
    updateApplicationStatus
) 
//candidate view their application status
router.get(
    "/my-applications",
    protect,
    authorizeRole("candidate"),
    getMyApplicaton
)
module.exports = router