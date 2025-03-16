const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const Resume = require("../models/resume.model");
const Employee = require("../models/employee.model");
const User = require("../models/user.model");
const Job = require("../models/job.model");
const backendUrl = process.env.FLASH_BACKEND;

// Configure AWS S3

// Create resume for user using PDF
const createResumeUsingPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`createResumeUsingPDF called for userId: ${userId}`);
    let ocrContent = [];
    let s3Link = "";

    if (req.file) {
      const filePath = req.file.path;
      console.log(`File uploaded at: ${filePath}`);

      // Read file into a buffer so it can be reused for OCR and S3 upload
      const fileBuffer = fs.readFileSync(filePath);
      console.log("File read into buffer successfully");

      // --- Step 1: Call OCR API ---
      const formOCR = new FormData();
      formOCR.append("file", fileBuffer, { filename: req.file.originalname });
      console.log(
        `Calling OCR API at ${backendUrl}/recruitment-project/pdfreader/ocr_only`
      );
      const ocrResponse = await axios.post(
        `${backendUrl}/recruitment-project/pdfreader/ocr_only`,
        formOCR,
        { headers: { ...formOCR.getHeaders() } }
      );
      console.log("OCR API response received:", ocrResponse.data);
      ocrContent = ocrResponse.data.content || [];

      // --- Step 2: Upload File to S3 ---
      console.log("Uploading file to S3 bucket 'rp-projects-public'");
      const params = {
        Bucket: "rp-projects-public",
        Key: `resumes/${userId}/${Date.now()}-${req.file.originalname}`,
        Body: fileBuffer,
        ContentType: req.file.mimetype,
      };
      const s3Upload = await new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
          if (err) {
            console.error("Error uploading to S3:", err);
            return reject(err);
          }
          console.log(
            "File uploaded to S3 successfully. Location:",
            data.Location
          );
          resolve(data);
        });
      });
      s3Link = s3Upload.Location;

      // Remove the local file after processing
      fs.unlinkSync(filePath);
      console.log(`Local file ${filePath} removed after processing`);
    } else if (req.body.resumeSummary) {
      console.log("No file uploaded. Using resumeSummary from request body.");
      ocrContent = [
        [
          {
            page_number: 1,
            content: req.body.resumeSummary,
          },
        ],
      ];
    } else {
      console.error("No resume file or summary provided");
      return res
        .status(400)
        .json({ error: "No resume file or summary provided" });
    }

    // --- Step 3: Save or Update Resume in Database ---
    console.log(`Checking if resume already exists for userId: ${userId}`);
    let resume = await Resume.findOne({ userId });
    if (resume) {
      console.log(
        "Existing resume found. Updating resume with new OCR content and S3 link (if available)."
      );
      resume.ocrContent = ocrContent;
      if (s3Link) {
        resume.filename = s3Link;
      }
    } else {
      console.log("No existing resume found. Creating new resume record.");
      resume = new Resume({
        userId,
        ocrContent,
        filename: s3Link || "",
      });
    }

    // Update experienceYears if provided in the request body
    if (req.body.experienceYears !== undefined) {
      resume.experienceYears = req.body.experienceYears;
      console.log(`Setting experienceYears to: ${req.body.experienceYears}`);
    }

    await resume.save();
    console.log("Resume saved to database successfully");

    // --- Step 4: Delete Existing Resume from Vector Search API ---
    console.log(
      `Deleting existing resume from vector search API for userId: ${userId}`
    );
    const deleteResponse = await axios.delete(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/${userId}`
    );
    console.log("Vector search DELETE response:", deleteResponse.data);
    if (!deleteResponse.data.message.includes("deleted successfully")) {
      console.error(
        "Failed to delete existing resume on vector search API:",
        deleteResponse.data
      );
      return res.status(500).json({
        error: "Failed to delete existing resume before updating",
      });
    }

    // --- Step 5: Synchronize with External API ---
    console.log(`Synchronizing resume with external API for userId: ${userId}`);
    // Extract the OCR text from the resume document's ocrContent
    const extractedContent = resume.ocrContent?.[0]?.[0]?.content || "";
    // Update the resume document with extracted resume_text and resume_id
    resume.resume_id = userId;
    resume.resume_text = extractedContent;
    await resume.save();
    console.log("Resume updated with resume_text in DB:", extractedContent);

    const externalResponse = await axios.post(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/`,
      {
        resume_id: userId,
        resume_text: extractedContent,
      }
    );
    console.log("External API response:", externalResponse.data);
    if (externalResponse.status !== 200) {
      console.error(
        "External API call failed with status:",
        externalResponse.status
      );
      return res.status(500).json({
        error: "Failed to synchronize with the external API",
      });
    }

    console.log(
      `createResumeUsingPDF completed successfully for userId: ${userId}`
    );
    return res.status(200).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Error in createResumeUsingPDF:", error);
    return res.status(500).json({ error: "Failed to create resume using PDF" });
  }
};

// Create resume for user using text
const createResumeUsingText = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`createResumeUsingText called for userId: ${userId}`);
    let ocrContent;

    // Use provided ocrContent from the request body if available,
    // otherwise, fall back to resumeSummary
    if (req.body.ocrContent) {
      console.log("Using provided ocrContent from request body.");
      ocrContent = req.body.ocrContent;
      // If ocrContent is a string, wrap it in a nested array structure to match our schema
      if (typeof ocrContent === "string") {
        ocrContent = [[{ page_number: 1, content: ocrContent }]];
      }
    } else if (req.body.resumeSummary) {
      console.log(
        "No ocrContent provided. Using resumeSummary from request body."
      );
      ocrContent = [[{ page_number: 1, content: req.body.resumeSummary }]];
    } else {
      console.error("No OCR content or summary provided");
      return res
        .status(400)
        .json({ error: "No OCR content or summary provided" });
    }

    // --- Step 1: Save or Update Resume in Database ---
    console.log(`Checking if resume already exists for userId: ${userId}`);
    let resume = await Resume.findOne({ userId });
    if (resume) {
      console.log(
        "Existing resume found. Updating resume with new OCR content and experienceYears if provided."
      );
      resume.ocrContent = ocrContent;
      if (req.body.experienceYears !== undefined) {
        resume.experienceYears = req.body.experienceYears;
      }
    } else {
      console.log("No existing resume found. Creating new resume record.");
      resume = new Resume({
        userId,
        ocrContent,
        experienceYears:
          req.body.experienceYears !== undefined
            ? req.body.experienceYears
            : null,
      });
    }
    await resume.save();
    console.log("Resume saved to database successfully");

    // --- Step 2: Delete Existing Resume from Vector Search API ---
    console.log(
      `Deleting existing resume from vector search API for userId: ${userId}`
    );
    const deleteResponse = await axios.delete(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/${userId}`
    );
    console.log("Vector search DELETE response:", deleteResponse.data);
    if (!deleteResponse.data.message.includes("deleted successfully")) {
      console.error(
        "Failed to delete existing resume on vector search API:",
        deleteResponse.data
      );
      return res.status(500).json({
        error: "Failed to delete existing resume before updating",
      });
    }

    // --- Step 3: Synchronize with External API ---
    console.log(`Synchronizing resume with external API for userId: ${userId}`);
    // Extract the OCR text from the stored ocrContent in the resume document
    const extractedContent = resume.ocrContent?.[0]?.[0]?.content || "";
    // Update the resume document with resume_text and resume_id fields
    resume.resume_id = userId;
    resume.resume_text = extractedContent;
    await resume.save();
    console.log("Resume updated with resume_text in DB:", extractedContent);

    const externalResponse = await axios.post(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/`,
      {
        resume_id: userId,
        resume_text: extractedContent,
      }
    );
    console.log("External API response:", externalResponse.data);
    if (externalResponse.status !== 200) {
      console.error(
        "External API call failed with status:",
        externalResponse.status
      );
      return res.status(500).json({
        error: "Failed to synchronize with the external API",
      });
    }

    console.log(
      `Create Resume Using Text completed successfully for userId: ${userId}`
    );
    return res.status(200).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error("Error in Create Resume Using Text:", error);
    return res
      .status(500)
      .json({ error: "Failed to create resume using OCR content" });
  }
};

// Search for resumes
const searchResumes = async (req, res) => {
  const { query_text, n_results } = req.body;
  if (!query_text || !n_results || isNaN(n_results)) {
    return res.status(400).json({
      error: "Please provide a valid query text and number of results",
    });
  }
  try {
    const response = await axios.post(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/search/`,
      { query_text, n_results }
    );
    const resumeData = response.data.map((resume) => ({
      id: resume.id,
      text: resume.text,
      distance: resume.distance,
    }));
    const resumes = await Resume.find({
      userId: { $in: resumeData.map((resume) => resume.id) },
    });
    const fetchedUserIds = resumes.map((resume) => resume.userId.toString());
    const missingIds = resumeData
      .map((resume) => resume.id)
      .filter((id) => !fetchedUserIds.includes(id));
    if (missingIds.length > 0) {
      console.warn("Missing resumes for user IDs:", missingIds);
    }
    const result = resumes.map((resume) => {
      const matchingResume = resumeData.find(
        (resumeItem) => resumeItem.id === resume.userId.toString()
      );
      return {
        ...resume.toObject(),
        distance: matchingResume.distance,
        text: matchingResume.text,
      };
    });
    res.status(200).json({
      message:
        missingIds.length > 0
          ? "Some resumes were not found in the database"
          : "Resumes fetched successfully",
      resumes: result,
      missingIds,
    });
  } catch (err) {
    console.error("Error fetching resume search results:", err.message);
    res.status(500).json({
      error: "An error occurred while searching for resumes",
    });
  }
};

// Upload video and link it to a resume
const uploadVideo = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(jobId)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const filePath = req.file.path;
    const fileStream = fs.createReadStream(filePath);
    const params = {
      Bucket: "rp-projects-public",
      Key: `videos/${userId}/${Date.now()}-${req.file.originalname}`,
      Body: fileStream,
      ContentType: req.file.mimetype,
    };
    s3.upload(params, async (err, data) => {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
      });
      if (err) {
        console.error("Error uploading video to S3:", err);
        return res.status(500).json({ error: "Error uploading video to S3" });
      }
      try {
        let resume = await Resume.findOne({ userId });

        if (!resume) {
          return res.status(404).json({ error: "Resume not found" });
        }

        // Ensure s3VideoLinks is an array
        if (!Array.isArray(resume.s3VideoLinks)) {
          resume.s3VideoLinks = [];
        }

        // Check if jobId already exists in s3VideoLinks, update if exists
        const videoIndex = resume.s3VideoLinks.findIndex(
          (entry) => entry.jobId.toString() === jobId
        );

        if (videoIndex !== -1) {
          // Update existing video entry
          resume.s3VideoLinks[videoIndex].link = data.Location;
        } else {
          // Add new video entry
          resume.s3VideoLinks.push({ jobId, link: data.Location });
        }

        // Call emotion prediction API asynchronously
        const emotionResponse = await axios.post(
          `${backendUrl}/recruitment-project/emotion/predict-emotion`,
          { s3_link: data.Location }
        );

        if (emotionResponse.data) {
          console.log("Emotion API Response:", emotionResponse.data);

          // Ensure emotionalLevel is an array
          if (!Array.isArray(resume.emotionalLevel)) {
            resume.emotionalLevel = [];
          }

          // Check if jobId already exists in emotionalLevel
          const emotionIndex = resume.emotionalLevel.findIndex(
            (entry) => entry.jobId.toString() === jobId
          );

          if (emotionIndex !== -1) {
            // Update existing emotional entry
            resume.emotionalLevel[emotionIndex].emotionLevel =
              emotionResponse.data;
          } else {
            // Add new emotional entry
            resume.emotionalLevel.push({
              jobId,
              emotionLevel: emotionResponse.data,
            });
          }

          console.log("Updated Emotional Level:", resume.emotionalLevel);
        }

        await resume.save();

        res.status(200).json({
          message: "Video uploaded successfully",
          userId,
          jobId,
          videoUrl: data.Location,
          emotionalLevel: resume.emotionalLevel,
        });
      } catch (dbErr) {
        console.error(
          "Error saving video URL or emotional level to database:",
          dbErr
        );
      }
    });
  } catch (err) {
    console.error("Error during video upload:", err.message);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

// Update personality text
const updatePersonalityText = async (req, res) => {
  try {
    const { userId, personalityText } = req.body;
    if (!userId || !personalityText) {
      return res
        .status(400)
        .json({ message: "UserId and personalityText are required." });
    }
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found for the given userId." });
    }
    let personalityPrediction;
    try {
      const response = await axios.post(
        `${backendUrl}/recruitment-project/personality/predict-personality`,
        { sentence: personalityText }
      );
      personalityPrediction = response.data;
    } catch (apiError) {
      return res.status(500).json({
        message: "Error predicting personality.",
        error: apiError.response?.data || apiError.message,
      });
    }
    resume.personalityText = personalityText;
    resume.personalityLevel = personalityPrediction;
    const updatedResume = await resume.save();
    res.status(200).json({
      message: "Personality text and level updated successfully.",
      data: updatedResume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating personality text.",
      error: error.message,
    });
  }
};

// Search for recommended resumes
const searchRecommendedResume = async (req, res) => {
  const { query_text } = req.body;
  if (!query_text) {
    return res.status(400).json({ error: "query_text is required." });
  }
  try {
    const payload = {
      query_text,
      n_results: 10,
    };
    const vectorSearchResponse = await axios.post(
      `${backendUrl}/recruitment-project/vectorsearch/resumes/search/`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    const responseData = vectorSearchResponse.data;
    const enrichedResults = await Promise.all(
      responseData.map(async (job) => {
        try {
          const objectId = new mongoose.Types.ObjectId(job.id);
          const resume = await Resume.findOne({ userId: objectId });
          if (!resume) {
            return {
              ...job,
              fullname: null,
              s3CVLink: null,
              s3VideoLinks: null,
              emotionalLevel: null,
              personalityLevel: null,
              employeePersonalityLevel: null,
            };
          }
          const user = await User.findById(resume.userId);
          if (!user) {
            return {
              ...job,
              fullname: null,
              s3CVLink: null,
              s3VideoLinks: null,
              emotionalLevel: null,
              personalityLevel: null,
              employeePersonalityLevel: null,
            };
          }
          const employeeDetails = await Employee.findOne({
            userId: resume.userId,
          });
          return {
            ...job,
            fullname: user.fullName,
            s3CVLink: resume.s3CVLink || null,
            s3VideoLinks: resume.s3VideoLinks || null,
            emotionalLevel: resume.emotionalLevel || null,
            personalityLevel: resume.personalityLevel || null,
            experienceYears: resume.experienceYears || null,
            employeePersonalityLevel: employeeDetails
              ? employeeDetails.employeePersonalityLevel
              : null,
          };
        } catch (err) {
          console.error(`Error enriching job ID ${job.id}:`, err.message);
          return {
            ...job,
            fullname: null,
            s3CVLink: null,
            s3VideoLinks: null,
            emotionalLevel: null,
            personalityLevel: null,
            employeePersonalityLevel: null,
          };
        }
      })
    );
    res.status(200).json(enrichedResults);
  } catch (error) {
    console.error("Error occurred while searching resumes:", error.message);
    res.status(500).json({ error: "An internal server error occurred." });
  }
};

// Retrieve OCR content by userId
const getOcrContent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }
  try {
    const resume = await Resume.findOne({ userId: id });
    if (!resume) {
      return res
        .status(404)
        .json({ error: "Resume not found for the specified user" });
    }
    res.status(200).json({ ocrContent: resume.ocrContent });
  } catch (error) {
    console.error("Error retrieving OCR content:", error.message);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

// Retrieve Resume Details by userId
const getResumeDetails = async (req, res) => {
  try {
    const { id: userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const resumes = await Resume.find({ userId })
      .populate("userId", "fullName email")
      .exec();
    if (!resumes || resumes.length === 0) {
      return res
        .status(404)
        .json({ message: "No resumes found for this user" });
    }
    res.status(200).json({
      message: "Resumes retrieved successfully",
      resumes,
    });
  } catch (err) {
    console.error("Error retrieving resumes:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve applicants for a job
const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId)
      .populate({ path: "selectedUsers", select: "fullName" })
      .populate({ path: "rejectedUsers", select: "fullName" })
      .populate({ path: "acceptedUsers", select: "fullName" });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const selectedUsersResumes = await Resume.find({
      userId: { $in: job.selectedUsers.map((user) => user._id) },
      s3CVLink: { $exists: true },
    });
    const rejectedUsersResumes = await Resume.find({
      userId: { $in: job.rejectedUsers.map((user) => user._id) },
      s3CVLink: { $exists: true },
    });
    const acceptedUsersResumes = await Resume.find({
      userId: { $in: job.acceptedUsers.map((user) => user._id) },
      s3CVLink: { $exists: true },
    });
    const formatUserResumes = (users, resumes) => {
      return users.map((user) => {
        const resume =
          resumes.find((r) => r.userId.toString() === user._id.toString()) ||
          {};
        const emotionLevel = resume.emotionalLevel
          ? resume.emotionalLevel.find(
              (emotion) => emotion.jobId.toString() === jobId
            )?.emotionLevel
          : null;
        const videoLink = resume.s3VideoLinks
          ? resume.s3VideoLinks.find((link) => link.jobId.toString() === jobId)
              ?.link
          : null;
        return {
          id: user._id,
          name: user.fullName,
          cvLink: resume.s3CVLink || "#",
          emotion: emotionLevel ? JSON.stringify(emotionLevel) : "N/A",
          videoLink: videoLink || "#",
        };
      });
    };
    return res.json({
      jobDetails: job,
      selectedUsers: formatUserResumes(job.selectedUsers, selectedUsersResumes),
      rejectedUsers: formatUserResumes(job.rejectedUsers, rejectedUsersResumes),
      acceptedUsers: formatUserResumes(job.acceptedUsers, acceptedUsersResumes),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching job details" });
  }
};

module.exports = {
  createResumeUsingPDF,
  createResumeUsingText,
  searchResumes,
  uploadVideo,
  updatePersonalityText,
  searchRecommendedResume,
  getOcrContent,
  getResumeDetails,
  getJobApplicants,
};
