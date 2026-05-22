const express = require("express");

const { createJob, getAllJobs, getSingleJob, updateJob, deleteJob } = require("../controllers/jobController");

const { protect, authorizeRole} = require("../middlewares/authMiddleware");

const router = express.Router();

//create job
router.post(
    "/create",
    protect,
    authorizeRole("recruiter"),
    createJob
);

//get job deatils
router.get("/",getAllJobs)

//get single job details
router.get("/:id",getSingleJob)

//update job by recruiter
router.put("/:jobId",
    protect,
    authorizeRole("recruiter"),
    updateJob)

//delete job by recruiter
router.delete("/:jobId",
    protect,
    authorizeRole("recruiter"),
    deleteJob
)
module.exports = router;
