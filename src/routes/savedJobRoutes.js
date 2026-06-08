const express = require("express");

const router = express.Router();

const { savedJob , getSavedJobs, removeSavedJob } = require("../controllers/savedJobController");

const {protect, authorizeRole} = require("../middlewares/authMiddleware");

router.post(
    "/:jobId",
    protect,
    authorizeRole("candidate"),
    savedJob
)

router.get(
    "/",
    protect,
    authorizeRole("candidate"),
    getSavedJobs
)

router.delete(
     "/:jobId",
    protect,
    authorizeRole("candidate"),
    removeSavedJob
)

module.exports = router