const Job = require("../models/Job");
const Application = require("../models/Application");

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
            recruiter : req.user._id
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
//get job for recruiter
const getAllJobs = async (req, res) => {
    try{
        const jobs = await Job.find()
                        .populate("recruiter","name email")
                        .sort({createdAt : -1});

        const jobWithCount = await Promise.all(
            jobs.map(async(job) => {
                const applicantCount = await Application.countDocuments({
                    job : job._id
                });

                return{
                    ...job.toObject(),
                    applicantCount
                };
            })
        )
        res.status(200).json({
            count : jobWithCount.length,
            jobs : jobWithCount
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

//update job which is done by the recruiter
const updateJob = async(req, res) => {
    try{
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                message : "Job not found"
            })
        }

        //check the owership
        if(job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message : "Access Denied"
            })
        }

        //update field
        job.title = req.body.title || job.title;
        job.company = req.body.company || job.company;
        job.location = req.body.location || job.location;
        job.description = req.body.description || job.description;
        job.skills = req.body.skills || job.skills;

        await job.save();

        res.status(200).json({
            message : "Job update successfully",
            job
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}


//Delete Job
    const deleteJob = async (req, res) => {
        try{
            const { jobId } = req.params;

            const job = await Job.findById(jobId);

            if(!job){
                return res.status(404).json({
                    message : "Job not found"
                })
            }

            if(job.recruiter.toString() !== req.user._id.toString()){
                return res.status(403).json({
                    message : "Access denied"
                })
            }

            //delete job 
            await job.deleteOne();

            res.status(200).json({
                message : "Job deleted successfully"
            })

        }catch(error){
            res.status(500).json({
                message : error.message
            })
        }
    }
module.exports = {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob
}