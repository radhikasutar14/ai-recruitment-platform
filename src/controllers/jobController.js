const { param } = require("../app");
const Job = require("../models/Job");

//create job
const createJob = async(req ,res) => {
    try{
        const{
            title,
            company,
            location,
            description,
            skills,
            salary
        } = req.body;

        const job = await Job.create({
            title,
            company,
            location,
            description,
            skills,
            salary,
            recruiter : req.currentUser.id
        });
        res.status(201).json({
            message : "Job created successfully",
            job
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
};
//get job
const getAllJobs = async (req, res) => {
    try{
        const jobs = await Job.find()
                        .populate("recruiter","name email")
                        .sort({createdAt : -1});

        res.status(200).json({
            count : jobs.length,
            jobs
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

//getting single job details
const getSingleJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
                    .populate("recruiter" , "name email")
        
        if(!job){
            return res.status(404).json({
                message : "Job not found"
            })
        }
        res.status(200).json(job);
    }catch(error){
        res.status(500).json({
            message : error.message,
        })
    }
}
module.exports = {
    createJob,
    getAllJobs,
    getSingleJob
}