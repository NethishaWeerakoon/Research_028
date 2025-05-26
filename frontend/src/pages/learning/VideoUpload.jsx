import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [job, setJob] = useState(null);
  const [hrQuestions, setHrQuestions] = useState([]);
  const { jobId } = useParams();

  // Default HR questions if not available
  const defaultHrQuestions = [
    "Tell us about yourself.",
    "Why are you interested in this position?",
    "What are your key strengths, and how do they relate to this role?",
    "Can you describe a challenging situation you faced and how you handled it?",
    "What motivates you to perform at your best?",
    "Describe a time when you had to make a difficult decision at work.",
    "Why do you want to work for our company?",
    "Can you share an example of a successful team project you worked on?",
    "What makes you the right fit for this role?",
    "How do you prioritize your tasks when managing multiple deadlines?",
  ];

  // Fetch job and HR questions on component mount
  // In your fetchJobData useEffect:
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}jobs/${jobId}`
        );
        setJob(response.data);

        // Process HR questions
        if (response.data.hrQuestions) {
          // First split by newlines to handle questions that were saved with line breaks
          let questions = response.data.hrQuestions
            .split("\n")
            .filter((q) => q.trim() !== "");

          // If no newlines found, try splitting by commas (but only if comma is followed by a space or end of string)
          if (questions.length <= 1) {
            questions = response.data.hrQuestions
              .split(/,(?=\s|$)/) // Split by commas followed by space or end of string
              .map((q) => q.trim())
              .filter((q) => q !== "");
          }

          setHrQuestions(questions.length > 0 ? questions : defaultHrQuestions);
        } else {
          setHrQuestions(defaultHrQuestions);
        }
      } catch (err) {
        console.error("Error fetching job data:", err);
        setHrQuestions(defaultHrQuestions);
      }
    };

    fetchJobData();
  }, [jobId]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      Swal.fire({
        title: "Error!",
        text: "Please select a video file to upload.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
      return;
    }

    // Get the user ID from localStorage
    const userString = localStorage.getItem("user");
    if (!userString) {
      Swal.fire({
        title: "Error!",
        text: "User not found. Please log in again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const user = JSON.parse(userString);
    const userId = user._id;

    const formData = new FormData();
    formData.append("video", videoFile);

    setLoading(true);

    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }resumes/upload-video/${userId}/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.videoUrl) {
        Swal.fire({
          title: "Success!",
          text: "Video uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "green",
        });
      }
    } catch (err) {
      console.error("Error uploading video:", err);
      Swal.fire({
        title: "Error!",
        text: "Error uploading video. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Questions Section */}
        <div className="bg-gray-50 p-6 rounded-lg w-full lg:w-1/2 mb-6 lg:mb-0 border">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
            Questions
          </h2>
          <ol className="list-decimal text-gray-600 space-y-2 pl-5">
            {hrQuestions.length > 0 ? (
              hrQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))
            ) : (
              <li>No questions available.</li>
            )}
          </ol>
        </div>

        {/* Instructions and Upload Section */}
        <div className="p-6 bg-gray-50 rounded-lg w-full lg:w-1/2 border">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
            Instructions
          </h2>
          <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
            Please upload a short video clip by answering these questions.
          </p>
          <ul className="list-decimal text-gray-600 space-y-1 pl-5 text-sm mb-6">
            <li>Maximum duration of a video is 5 minutes.</li>
            <li>File size should not exceed 25mb.</li>
            <li>
              Use a clean and professional background with proper lighting.
            </li>
            <li>
              Record using a stable camera and keep the camera at eye level.
            </li>
            <li>Ensure there is minimal background noise.</li>
          </ul>

          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500">
            <p className="mb-2 text-center text-gray-600">
              Drag & Drop files here
            </p>
            <span className="text-gray-400 mb-4">or</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600"
            >
              Browse Files
            </label>

            {/* Display Selected File */}
            {videoFile && (
              <p className="mt-2 text-gray-600">
                Selected File: <strong>{videoFile.name}</strong>
              </p>
            )}
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center mt-4">
              <div className="loader border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 mt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500 w-full"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFileUpload}
              className="px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 w-full"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
