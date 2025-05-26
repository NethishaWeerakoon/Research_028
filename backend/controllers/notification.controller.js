const Notification = require("../models/notification.model");
const Job = require("../models/job.model");

//  Notify job seeker
const acceptJobNotification = async (req, res) => {
  try {
    const { jobId, userId, message, accepted } = req.body;

    // Find the job post
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the user has already been accepted or rejected
    if (
      job.acceptedUsers.includes(userId) ||
      job.rejectedUsers.includes(userId)
    ) {
      return res
        .status(400)
        .json({ error: "User has already been processed for this job" });
    }

    // Create a notification for the user
    const notification = new Notification({
      userId,
      message: accepted
        ? `Your application for the job "${job.title}" has been accepted! ${message}`
        : `Your application for the job "${job.title}" has been rejected.`,
      accepted,
    });

    await notification.save();

    res.status(200).json({
      jobId,
      userId,
      accepted,
      message: accepted
        ? `User has been accepted for the job "${job.title}".`
        : `User has been rejected for the job "${job.title}".`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
};

// Update notification status
const updateNotificationStatus = async (req, res) => {
  try {
    const { jobId, userId, accepted, message } = req.body;

    // Find the job post
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if the user is already in the current status list
    const isAccepted = job.acceptedUsers.includes(userId);
    const isRejected = job.rejectedUsers.includes(userId);

    if (accepted) {
      if (isRejected) {
        job.rejectedUsers.pull(userId);
      }
      if (!isAccepted) {
        job.acceptedUsers.push(userId);
      }
    } else {
      if (isAccepted) {
        job.acceptedUsers.pull(userId);
      }
      if (!isRejected) {
        job.rejectedUsers.push(userId);
      }
    }

    // Save the job with updated status
    await job.save();

    // Create a notification for the user
    const notification = new Notification({
      userId,
      message: accepted
        ? `Your application for the job "${job.title}" has been accepted! ${message}`
        : `Your application for the job "${job.title}" has been rejected.`,
      accepted,
    });

    await notification.save();

    res.status(200).json({
      jobId,
      userId,
      accepted,
      message: `User has been ${
        accepted ? "accepted" : "rejected"
      } for the job "${job.title}".`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the status" });
  }
};

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    });

    if (notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

module.exports = {
  acceptJobNotification,
  updateNotificationStatus,
  getNotifications,
};
