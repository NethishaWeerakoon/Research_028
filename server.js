const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const userRoute = require("./routers/user.router");
const resumeRoute = require("./routers/resume.router");
const jobRoute = require("./routers/job.router");
const employeeRoute = require("./routers/employee.router");
const learnRoute = require("./routers/learn.router");
const notificationRoute = require("./routers/notification.router");

const app = express();
const PORT = process.env.PORT || 5000;

const URI =
  "mongodb+srv://avishkwork:avishkwork@krc.j6glplq.mongodb.net/?retryWrites=true&w=majority&appName=KRC";

mongoose
  .connect(URI, { dbName: "mydatabase" })
  .then(() => console.log("Database is connected"))
  .catch((err) => console.error("Database connection error:", err)); 
 
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users", userRoute); 
app.use("/api/resumes", resumeRoute);
app.use("/api/jobs", jobRoute);  
app.use("/api/employee", employeeRoute);
app.use("/api/learn", learnRoute);
app.use("/api/notification", notificationRoute);  

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); 
});
 