const Job = require("../models/job.model");
const axios = require("axios");
const backendUrl = process.env.FLASH_BACKEND;
const AWS = require("aws-sdk");
const fs = require("fs");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");
const multer = require("multer");

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: "AKIA3TD2SWQWBD2L3MOW",
  secretAccessKey: "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",
  region: "us-east-1",
});

// Setup Multer for file upload
const upload = multer({ dest: "uploads/" }); // Files will be stored temporarily here

// Create a New Job Post
const createJob = async (req, res) => {
  const {
    title,
    experienceYears,
    email,
    phoneNumber,
    description,
    requirements,
    userId,
    hrQuestions,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !experienceYears ||
    !email ||
    !phoneNumber ||
    !description ||
    !requirements ||
    !userId
  ) {
    return res.status(400).json({
      error:
        "All fields are required: title, experienceYears, email, phoneNumber, description, requirements, userId",
    });
  }

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: "Logo file is required" });
  }

  try {
    // Read the uploaded file from the temporary storage
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);

    const params = {
      Bucket: "rp-projects-public",
      Key: `logos/${userId}/${Date.now()}-${req.file.originalname}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
    };

    // Upload logo to S3
    s3.upload(params, async (err, data) => {
      // Delete the temporary file after uploading
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });

      if (err) {
        console.error("Error uploading logo to S3:", err);
        return res.status(500).json({ error: "Error uploading logo to S3" });
      }

      try {
        // Save the job data to the database
        const newJob = new Job({
          title,
          experienceYears,
          email,
          phoneNumber,
          description,
          requirements,
          userId,
          logo: data.Location,
          hrQuestions,
        });

        const savedJob = await newJob.save();

        // Prepare job text for vector API calls
        const jobText = `${title}${description}${experienceYears}${requirements}`;

        // First API Call: Send job details to vector save jobs API
        try {
          const apiResponse = await axios.post(
            `${backendUrl}/recruitment-project/vectorsearch/jobs/`,
            {
              job_id: savedJob._id.toString(),
              job_text: jobText,
            }
          );
          console.log("Vector Job API Response:", apiResponse.data);
        } catch (jobApiError) {
          console.error(
            "Error calling vector job API:",
            jobApiError.response?.data || jobApiError.message
          );
        }

        // Second API Call: Retrieve matching resumes
        let matchedResumes = [];
        try {
          const vectorSearchResponse = await axios.post(
            `${backendUrl}/recruitment-project/vectorsearch/resumes/search/`,
            {
              query_text: jobText,
              n_results: 50,
            }
          );

          matchedResumes = vectorSearchResponse.data || [];
        } catch (resumeApiError) {
          console.error(
            "Error calling resume vector search API:",
            resumeApiError.response?.data || resumeApiError.message
          );
        }

        // Helper function to format distance into a matching percentage
        function formatDistancePercentage(distance) {
          if (distance === 0) {
            return 100.0;
          }
          const percentage = 100 * (1 / (1 + distance));
          return Number(percentage.toFixed(2));
        }

        // Create notifications for matched users if any
        if (matchedResumes.length > 0) {
          const notifications = matchedResumes.map(({ id, distance }) => ({
            userId: new mongoose.Types.ObjectId(id),
            message: `New Job Available: ${title}. Your matching percentage is ${
              typeof distance === "number"
                ? formatDistancePercentage(distance) + "%"
                : "N/A"
            }`,
            link: `http://45.134.226.131:9102/jobs/${savedJob._id}`,
          }));
          await Notification.insertMany(notifications);
        }

        // Respond with the created job and matched candidates
        res.status(201).json({
          message: "Job created successfully, candidates notified",
          job: savedJob,
          matchedCandidates: matchedResumes,
        });
      } catch (apiError) {
        console.error("Error processing job creation:", apiError.message);
        res.status(500).json({
          error:
            "Job created, but an error occurred while processing candidate matching",
        });
      }
    });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "An error occurred while creating the job" });
  }
};

// Search for jobs
const searchJobs = async (req, res) => {
  const { jobType, jobCount } = req.body;

  if (!jobType || !jobCount || isNaN(jobCount)) {
    return res.status(400).json({
      error: "Please provide a valid job type and job count",
    });
  }
  try {
    const response = await axios.post(
      `${backendUrl}/recruitment-project/vectorsearch/jobs/search/`,
      {
        query_text: jobType,
        n_results: jobCount,
      }
    );

    // Extract job IDs and distances from the external API response
    const jobData = response.data.map((job) => ({
      id: job.id,
      distance: job.distance,
    }));

    // Fetch full job details from the database using the job IDs
    const jobs = await Job.find({ _id: { $in: jobData.map((job) => job.id) } });

    if (jobs.length !== jobData.length) {
      return res.status(404).json({
        error: "Some jobs were not found in the database",
      });
    }

    // Combine MongoDB job data with the distance value from the external API
    const result = jobs.map((job) => {
      const matchingJob = jobData.find(
        (jobItem) => jobItem.id === job._id.toString()
      );
      return {
        ...job.toObject(),
        distance: matchingJob.distance,
      };
    });
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching job search results:", err);
    res.status(500).json({
      error: "An error occurred while searching for jobs",
    });
  }
};

// Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({
      error: "An error occurred while fetching jobs",
    });
  }
};

// Get a job by ID
const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({
      error: "An error occurred while fetching the job",
    });
  }
};

// Update a job
const updateJob = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedJob = await Job.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({
      error: "An error occurred while updating the job",
    });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  const { job_id } = req.params;
  try {
    const deletedJob = await Job.findByIdAndDelete(job_id);
    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found in database" });
    }

    // Delete job from external vector API
    const externalResponse = await axios.delete(
      `${backendUrl}/recruitment-project/vectorsearch/jobs/${job_id}`
    );

    if (externalResponse.status !== 200) {
      return res.status(500).json({
        error: "Failed to delete job from external API",
      });
    }
    res.status(200).json({
      message: "Job deleted successfully from both database and external API",
      job: deletedJob,
    });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({
      error: "An error occurred while deleting the job",
    });
  }
};

// Get user created jobs
const getUserCreatedJobs = async (req, res) => {
  const { userId } = req.params;
  try {
    const jobs = await Job.find({ userId });
    if (jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this user" });
    }
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by user ID:", error);
    res.status(500).json({ error: "An error occurred while fetching jobs" });
  }
};

// Update user Status for a job
const updateUserStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      userId,
      acceptedUsers,
      rejectedUsers,
      appliedUsers,
      selectedUsers,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Remove the user from all status arrays first
    job.acceptedUsers = job.acceptedUsers.filter(
      (id) => id.toString() !== userId
    );
    job.rejectedUsers = job.rejectedUsers.filter(
      (id) => id.toString() !== userId
    );
    job.appliedUsers = job.appliedUsers.filter(
      (id) => id.toString() !== userId
    );
    job.selectedUsers = job.selectedUsers.filter(
      (id) => id.toString() !== userId
    );

    // Add the user to the appropriate array based on the request
    if (acceptedUsers === true) {
      job.acceptedUsers.push(userId);
    } else if (rejectedUsers === true) {
      job.rejectedUsers.push(userId);
    } else if (appliedUsers === true) {
      job.appliedUsers.push(userId);
    } else if (selectedUsers === true) {
      job.selectedUsers.push(userId);

      // Create a notification for the selected user
      const notification = new Notification({
        userId,
        message:
          "You are selected for this job. Please upload a video for the HR interview.",
        link: `http://45.134.226.131:9102/jobs/${jobId}`,
      });

      await notification.save();
    }

    // Save the updated job document
    await job.save();

    return res
      .status(200)
      .json({ message: "User status updated successfully", job });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createJob,
  searchJobs,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getUserCreatedJobs,
  updateUserStatus,
  upload,
};
