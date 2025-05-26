const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

// Notify job seeker
router.post("/accept-job", notificationController.acceptJobNotification);

// Update notification status
router.put("/update-status", notificationController.updateNotificationStatus);

// Get notifications for a user
router.get("/:userId", notificationController.getNotifications);

module.exports = router;
