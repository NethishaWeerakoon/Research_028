import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Loading";
import UploadResumeDialog from "./UploadResume";
import JobMatchScoreChart from "../../components/JobMatchScoreChart2"; // Import chart

const ResumeDetails = () => {
  const [resumes, setResumes] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]); // Add recommended jobs state
  const [loading, setLoading] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(false); // loading for jobs
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null); // to track job fetch error
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;

  useEffect(() => {
    fetchResumes();
    fetchRecommendedJobs();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}resumes/${userId}`
      );
      setResumes(response.data.resumes);
    } catch (err) {
      console.error("Error fetching resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedJobs = async () => {
    setLoadingJobs(true);
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setError("User not found. Please log in again.");
        setLoadingJobs(false);
        return;
      }
      const user = JSON.parse(userString);
      const resOcr = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}resumes/ocr-content/${user._id}`
      );
      const jobType = resOcr.data.ocrContent?.[0]?.[0]?.content;

      let resJobs;
      if (jobType) {
        const searchRes = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}jobs/search`,
          { jobType, jobCount: 50 }
        );
        resJobs = searchRes.data.filter((job) => job.distance > 0);
      } else {
        const allJobsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}jobs/all`);
        resJobs = allJobsRes.data;
      }

      setRecommendedJobs(resJobs);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch recommended jobs.", err);
      setError("Failed to fetch recommended jobs.");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDialogSubmit = async ({ file, experienceYears }) => {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("experienceYears", experienceYears);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}resumes/create-resume-pdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      fetchResumes();
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert(error.response?.data?.error || "Failed to upload resume.");
      setMessage(error.response?.data?.error || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const formatPersonalityLevels = (personalityLevel) => {
    return (
      Object.entries(personalityLevel)
        .map(([key, value]) => `${key}: ${(parseFloat(value) * 100).toFixed(0)}%`)
        .join(", ") || "N/A"
    );
  };

  if (loading) {
    return (
      <div>
        <Loading />
        <p className="text-left text-gray-600">Loading resumes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full mb-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">My Profile</h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsDialogOpen(true)}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload Resume"}
        </button>
      </div>

      <UploadResumeDialog
        isOpen={isDialogOpen}
        closeDialog={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Full Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Experience (Years)</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">Personality Level</th>
              <th className="px-4 py-2 border border-gray-300 text-left text-gray-600 font-semibold">CV Link</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume._id} className="odd:bg-white even:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.userId.fullName}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.userId.email}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{resume.experienceYears}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">{formatPersonalityLevels(resume.personalityLevel)}</td>
                <td className="px-4 py-2 border border-gray-300 text-left">
                  {resume.filename ? (
                    <a href={resume.filename} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a>
                  ) : (
                    "N/A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JOB MATCH SCORE CHART UNDER THE TABLE */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-indigo-800 mb-4 text-center">
          Recommended Jobs Matching Percentage
        </h2>

        {loadingJobs ? (
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          recommendedJobs.length > 0 ? (
            <JobMatchScoreChart jobs={recommendedJobs} />
          ) : (
            <p className="text-center text-gray-500">No recommended jobs to display.</p>
          )
        )}
      </div>
    </div>
  );
};

export default ResumeDetails;
