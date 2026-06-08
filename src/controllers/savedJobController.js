const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

const savedJob = async(req, res) => {
    try{
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                message : "Job not found"
            })
        }
        const savedJob = await SavedJob.create({
            candidate : req.user._id,
            job : jobId
        });

        res.status(201).json({
            message : "Job saved successfully",
            savedJob
        })

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

//getting saved job
const getSavedJobs = async(req,res) => {
    try{

        const savedJobs =
            await SavedJob.find({
                candidate : req.user._id
            })
            .populate({
                path : "job",
                populate : {
                    path : "recruiter",
                    select : "name email"
                }
            });

        res.status(200).json(savedJobs);

    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

//removing saved job
const removeSavedJob = async(req,res) => {
    try{
        const { jobId } = req.params;

        await SavedJob.findOneAndDelete({
            candidate : req.user._id,
            job : jobId
        });

        res.status(200).json({
            message : "Saved job removed"
        });

    }catch(error){
        res.status(500).json({
            message : error.message
        });
    }
};

module.exports = {
    savedJob,
    getSavedJobs,
    removeSavedJob
}