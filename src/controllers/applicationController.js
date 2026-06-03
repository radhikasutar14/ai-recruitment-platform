const Application = require("../models/Application");
const Job = require("../models/Job");

//apply job
const applyJob = async (req , res) => {
    try{
        const { jobId } = req.params;           //data accessing using url so use req.params.id

        //check job exist
        const job = await Job.findById(jobId);      //prevent applying to fake/non-existing jobs

        if(!job){
            return res.status(404).json({
                message : "Job not found"
            })
        }

        //check if already applied
        const alreadyApplied = await Application.findOne({      //prevent duplicate application
            candidate : req.user._id,
            job : jobId
        });

        if(alreadyApplied){
            return res.status(400).json({
                message : "Already applied for this job"
            })
        }
    
    //create application
    const application = await Application.create({
        candidate : req.user._id,
        job : jobId
    });

    res.status(201).json({
        message : "Job applied successfully",
        application
    });
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

//get applications from recruiter job
const getJobApplications = async(req, res) => {
    try{
        const { jobId } = req.params;

        //check job exist
        const job = await Job.findById(jobId); 

        if(!job){
            return res.status(404).json({
                message : "Job not found"
            })
        }

    //recruiter can only view own jobs
    if(job.recruiter.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message : "Access denied",
        })
    }

    //get application
    const applications = await Application.find({
        job : jobId,
    })
    .populate("candidate", "name email role")
    .populate("job", "title company");
    
    res.status(200).json(applications)
    }catch(error){
        res.status(500).json({
                message : error.message
        })
    }
}

//update application status // on the basisof applicatoin for recruiter
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId }  = req.params;

        const { status } = req.body;

        //valid statues
        const validStatuses = [
            "pending",
            "shortlisted",
            "rejected"
        ];

        if(!validStatuses.includes(status)){
            return res.status(400).json({
                message : "Invalid status value"
            })
        }

        //find application
        const application = await Application.findById(applicationId)
                            .populate("job")
                            .populate("candidate", "name email role");

        if(!application){
            return res.status(404).json({
                message : "Application not found"
            })
        }

        //recruiter owernship check
        if(application.job.recruiter.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message : "Access denied",
            })
        }

        //updatestatus
        application.status = status;
        await application.save();

        res.status(200).json({
            message : "Application status updated",
            application
        })
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

//candidate can view their updated application status
const getMyApplicaton = async(req, res) => {
    try{
        const applications = await Application.find({       //find all application where logged in candidate have apply
            candidate : req.user._id
        }).populate("job","title company location")

        const validApplication = applications.filter((application) => application.job !== null)

        res.status(200).json(validApplication)
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
} 
module.exports = {
    applyJob,
    getJobApplications,
    updateApplicationStatus,
    getMyApplicaton
}