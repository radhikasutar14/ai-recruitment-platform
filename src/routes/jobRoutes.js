const express = require("express");

const { createJob, getAllJobs, getSingleJob } = require("../controllers/jobController");

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

module.exports = router;
